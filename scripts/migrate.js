import { createClient } from '@sanity/client';
import fs from 'fs';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const projectId = process.env.SANITY_PROJECT_ID || 'bs10tt9p';
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error('Error: SANITY_TOKEN is not defined in the environment variables.');
  process.exit(1);
}

// Define the Sanity client with credentials
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-06-04',
  token,
  useCdn: false,
});

// Helper to decode HTML entities in text
function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x3D;/g, '=');
}

// Parse inner HTML to Sanity Portable Text block (handling bold, italic, underline, code, links)
function parseHtmlToBlock(html, tag) {
  const tokenRegex = /<[^>]+>|[^<]+/g;
  const tokens = html.match(tokenRegex) || [];
  
  const children = [];
  const markDefs = [];
  let currentMarks = [];
  
  let linkCounter = 0;
  const openLinksStack = [];

  for (const token of tokens) {
    if (token.startsWith('<') && token.endsWith('>')) {
      const isClosing = token.startsWith('</');
      const tagContent = token.replace(/[<>]/g, '').trim();
      const tagName = tagContent.toLowerCase().split(/\s+/)[0];

      if (isClosing) {
        const cleanTagName = tagName.substring(1);
        if (cleanTagName === 'strong' || cleanTagName === 'b') {
          currentMarks = currentMarks.filter(m => m !== 'strong');
        } else if (cleanTagName === 'em' || cleanTagName === 'i') {
          currentMarks = currentMarks.filter(m => m !== 'em');
        } else if (cleanTagName === 'u') {
          currentMarks = currentMarks.filter(m => m !== 'underline');
        } else if (cleanTagName === 'code') {
          currentMarks = currentMarks.filter(m => m !== 'code');
        } else if (cleanTagName === 'a') {
          const closedLinkKey = openLinksStack.pop();
          if (closedLinkKey) {
            currentMarks = currentMarks.filter(m => m !== closedLinkKey);
          }
        }
      } else {
        if (tagName === 'strong' || tagName === 'b') {
          if (!currentMarks.includes('strong')) currentMarks.push('strong');
        } else if (tagName === 'em' || tagName === 'i') {
          if (!currentMarks.includes('em')) currentMarks.push('em');
        } else if (tagName === 'u') {
          if (!currentMarks.includes('underline')) currentMarks.push('underline');
        } else if (tagName === 'code') {
          if (!currentMarks.includes('code')) currentMarks.push('code');
        } else if (tagName === 'a') {
          const hrefMatch = tagContent.match(/href=["']([^"']+)["']/i);
          const href = hrefMatch ? hrefMatch[1] : '';
          if (href) {
            const markKey = `link_${Date.now()}_${linkCounter++}`;
            markDefs.push({
              _key: markKey,
              _type: 'link',
              href: href
            });
            currentMarks.push(markKey);
            openLinksStack.push(markKey);
          }
        }
      }
    } else {
      const text = decodeHtmlEntities(token);
      if (text) {
        const span = {
          _type: 'span',
          text: text
        };
        if (currentMarks.length > 0) {
          span.marks = [...currentMarks];
        }
        children.push(span);
      }
    }
  }

  if (children.length === 0) {
    children.push({ _type: 'span', text: '' });
  }

  const block = {
    _type: 'block',
    children: children
  };
  
  if (markDefs.length > 0) {
    block.markDefs = markDefs;
  }

  if (tag.startsWith('h')) {
    const level = parseInt(tag.substring(1)) || 2;
    block.style = `h${level}`;
  } else if (tag === 'li') {
    block.style = 'normal';
    block.listItem = 'bullet';
  } else {
    block.style = 'normal';
  }

  return block;
}

// Clean and reconstruct Wix tables to clean standard HTML
function cleanTableHtml(tableHtml) {
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t(d|h)[^>]*>([\s\S]*?)<\/t\1>/gi;
  
  let matchRow;
  const cleanRows = [];
  
  while ((matchRow = rowRegex.exec(tableHtml)) !== null) {
    const rowContent = matchRow[1];
    let matchCell;
    const cleanCells = [];
    
    while ((matchCell = cellRegex.exec(rowContent)) !== null) {
      const cellTag = matchCell[1]; // 'd' or 'h'
      const cellContent = matchCell[2];
      
      let text = cellContent
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '')
        .replace(/<div style="position:absolute;[^>]*>.*?<\/div>/gi, '')
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '')
        .trim();
        
      if (text === '<br/>' || text === '<br role="presentation"/>') {
        text = '';
      }
      
      cleanCells.push(`<t${cellTag}>${text}</t${cellTag}>`);
    }
    
    if (cleanCells.length > 0) {
      cleanRows.push(`<tr>${cleanCells.join('')}</tr>`);
    }
  }
  
  if (cleanRows.length === 0) return '';
  
  return `<table class="blog-rich-table"><tbody>${cleanRows.join('')}</tbody></table>`;
}

async function runMigration() {
  const xmlFile = './feed.xml';
  if (!fs.existsSync(xmlFile)) {
    console.error(`Error: File "${xmlFile}" not found in root directory.`);
    return;
  }

  try {
    const xmlData = fs.readFileSync(xmlFile, 'utf-8');
    const result = await parseStringPromise(xmlData);
    const items = result.rss.channel[0].item || [];

    console.log(`Found ${items.length} posts to migrate inside "${xmlFile}".`);

    // Ensure default author exists in Sanity
    const authorDoc = {
      _type: 'author',
      _id: 'default-author',
      name: 'Rajesh Koppula',
      role: 'CEO & Managing Partner',
    };

    console.log('Ensuring default author exists in Sanity...');
    await client.createOrReplace(authorDoc);
    console.log('Author "Rajesh Koppula" is ready.\n');

    const defaultAuthorRef = {
      _type: 'reference',
      _ref: 'default-author'
    };

    for (const item of items) {
      const title = item.title[0];
      const pubDate = new Date(item.pubDate[0]).toISOString();
      const link = item.link[0];
      
      // Clean up slug
      let slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      if (!slug) slug = 'post-' + Math.floor(Math.random() * 10000);

      console.log(`========================================`);
      console.log(`Processing: "${title}"`);
      console.log(`URL: ${link}`);

      // 1. Fetch full content from the live post link
      let bodyBlocks = [];
      let excerpt = item.description[0].replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...';
      
      try {
        console.log(`-> Fetching full article text...`);
        const pageRes = await fetch(link);
        if (pageRes.ok) {
          const html = await pageRes.text();
          
          // Find all tables
          const tables = [];
          const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
          let matchTable;
          
          while ((matchTable = tableRegex.exec(html)) !== null) {
            const cleanTable = cleanTableHtml(matchTable[0]);
            if (cleanTable) {
              tables.push({
                type: 'table',
                index: matchTable.index,
                length: matchTable[0].length,
                html: cleanTable
              });
            }
          }
          
          // Find all viewer tags
          const viewerElements = [];
          const tagRegex = /<(p|h1|h2|h3|h4|h5|h6|div|li)[^>]*\bid="viewer-[^"]+"[^>]*>([\s\S]*?)<\/\1>/gi;
          let matchTag;
          
          while ((matchTag = tagRegex.exec(html)) !== null) {
            viewerElements.push({
              type: 'tag',
              index: matchTag.index,
              length: matchTag[0].length,
              tag: matchTag[1].toLowerCase(),
              innerHtml: matchTag[2].trim()
            });
          }
          
          // Filter out viewer tags nested inside tables
          const filteredViewers = viewerElements.filter(tagEl => {
            const isInsideTable = tables.some(tbl => {
              return tagEl.index >= tbl.index && (tagEl.index + tagEl.length) <= (tbl.index + tbl.length);
            });
            return !isInsideTable;
          });
          
          // Combine and sort chronologically
          const combined = [
            ...tables.map(t => ({ index: t.index, type: 'table', html: t.html })),
            ...filteredViewers.map(v => ({ index: v.index, type: 'tag', tag: v.tag, innerHtml: v.innerHtml }))
          ].sort((a, b) => a.index - b.index);
          
          const blocks = [];
          for (const item of combined) {
            if (item.type === 'table') {
              blocks.push({
                _type: 'block',
                style: 'table',
                children: [{ _type: 'span', text: item.html }]
              });
            } else {
              if (item.innerHtml) {
                const block = parseHtmlToBlock(item.innerHtml, item.tag);
                blocks.push(block);
              }
            }
          }
          
          if (blocks.length > 0) {
            bodyBlocks = blocks;
            
            // Extract a clean excerpt from the first paragraph
            const firstParaBlock = blocks.find(b => b.style === 'normal' && !b.listItem);
            if (firstParaBlock) {
              const textContent = firstParaBlock.children.map(c => c.text).join('');
              excerpt = textContent.substring(0, 160).trim() + '...';
            }
            console.log(`-> Extracted ${blocks.length} formatted blocks (including tables) from HTML.`);
          } else {
            console.log(`-> No content blocks found in HTML body. Falling back to RSS description.`);
            throw new Error("No elements found");
          }
        } else {
          console.warn(`-> HTTP ${pageRes.status} fetching page. Falling back to RSS description.`);
          throw new Error(`HTTP ${pageRes.status}`);
        }
      } catch (err) {
        // Fall back to description split if fetch/parsing fails
        const paragraphs = item.description[0].split(/<\/p>/i)
          .map(p => p.replace(/<p>/i, '').trim())
          .filter(Boolean);
        bodyBlocks = paragraphs.map(pText => parseHtmlToBlock(pText, 'p'));
      }

      // 2. Upload main cover image from enclosure tag
      let mainImageRef = null;
      if (item.enclosure && item.enclosure[0] && item.enclosure[0].$ && item.enclosure[0].$.url) {
        const imageUrl = item.enclosure[0].$.url;
        try {
          console.log(`-> Downloading and uploading cover image...`);
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            const filename = imageUrl.split('/').pop().split('?')[0] || 'cover.png';
            const asset = await client.assets.upload('image', buffer, { filename });
            mainImageRef = {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            };
            console.log(`-> Image asset created successfully (Asset ID: ${asset._id})`);
          } else {
            console.warn(`-> HTTP ${imgRes.status} downloading image.`);
          }
        } catch (imgErr) {
          console.error(`-> Cover image upload skipped due to error:`, imgErr.message);
        }
      }

      // 3. Assemble document and upload
      const doc = {
        _type: 'post',
        _id: `imported-${slug}`, // Set deterministic ID to prevent duplicates on re-run
        title: title,
        slug: {
          _type: 'slug',
          current: slug
        },
        postType: 'blog',
        publishedAt: pubDate,
        readTime: item.description[0].length > 1000 ? '10 Min Read' : '5 Min Read',
        category: item.category ? item.category[0] : 'Strategic Advisory',
        author: defaultAuthorRef,
        excerpt: excerpt,
        body: bodyBlocks
      };

      if (mainImageRef) {
        doc.mainImage = mainImageRef;
      }

      console.log(`-> Creating/Updating post in Sanity...`);
      const created = await client.createOrReplace(doc);
      console.log(`-> Successfully imported! (Sanity ID: ${created._id})\n`);
    }

    console.log('\n--- Migration Finished Successfully! ---');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
