export const SANITY_PROJECT_ID = 'bs10tt9p';
export const SANITY_DATASET = 'production';

/**
 * Parses and filters posts locally from blogs.json based on key GROQ query terms
 */
function evaluateLocalQuery(posts, query) {
  let result = [...posts];

  // 1. Filter by postType
  if (query.includes('postType == "whitepaper"')) {
    result = result.filter(p => p.postType === 'whitepaper');
  } else if (query.includes('postType == "blog"')) {
    result = result.filter(p => p.postType === 'blog' || !p.postType);
  }

  // 2. Filter by slug
  if (query.includes('slug.current == "')) {
    const match = query.match(/slug\.current == "([^"]+)"/);
    if (match) {
      const slugVal = match[1];
      result = result.filter(p => {
        const pSlug = (p.slug && p.slug.current) || p.slug;
        return pSlug === slugVal;
      });
    }
  }

  // 3. Sort by publishedAt desc
  if (query.includes('order(publishedAt desc)')) {
    result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  // 4. Return single item if requested
  if (query.trim().endsWith('[0]') || query.includes('][0]')) {
    return result[0] || null;
  }

  return result;
}

/**
 * Lightweight client-side fetch helper for Sanity CMS
 * @param {string} groqQuery 
 * @returns {Promise<any>}
 */
export async function fetchFromSanity(groqQuery) {
  const encodedQuery = encodeURIComponent(groqQuery);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${encodedQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.warn('[SANITY API ERROR]: Falling back to local data/blogs.json fallback.', error);
    try {
      const response = await fetch('./data/blogs.json');
      if (!response.ok) {
        throw new Error(`Failed to load local blogs.json: ${response.status}`);
      }
      const data = await response.json();
      const posts = data.result || [];
      return evaluateLocalQuery(posts, groqQuery);
    } catch (fallbackError) {
      console.error('[FALLBACK ERROR]: Failed to load local blogs fallback.', fallbackError);
      throw error;
    }
  }
}
