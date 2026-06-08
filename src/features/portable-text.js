export function renderPortableText(body, containerEl) {
  // Helper to render formatted spans inside blocks (bold, italic, links, etc.)
  function renderBlockContent(block, parentElement) {
    if (!block.children || !Array.isArray(block.children)) return;
    block.children.forEach(child => {
      let el = document.createTextNode(child.text);
      if (child.marks && Array.isArray(child.marks) && child.marks.length > 0) {
        child.marks.forEach(mark => {
          if (mark === 'strong') {
            const strong = document.createElement('strong');
            strong.appendChild(el);
            el = strong;
          } else if (mark === 'em') {
            const em = document.createElement('em');
            em.appendChild(el);
            el = em;
          } else if (mark === 'underline') {
            const u = document.createElement('u');
            u.appendChild(el);
            el = u;
          } else if (mark === 'code') {
            const code = document.createElement('code');
            code.appendChild(el);
            el = code;
          } else if (block.markDefs && Array.isArray(block.markDefs)) {
            const def = block.markDefs.find(d => d._key === mark);
            if (def && def._type === 'link') {
              const a = document.createElement('a');
              a.href = def.href;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.appendChild(el);
              el = a;
            }
          }
        });
      }
      parentElement.appendChild(el);
    });
  }

  containerEl.innerHTML = '';
  
  if (Array.isArray(body)) {
    let currentList = null;
    let currentListType = null;

    body.forEach(block => {
      if (block._type === 'block') {
        if (block.listItem) {
          const listType = block.listItem === 'number' ? 'ol' : 'ul';
          if (!currentList || currentListType !== block.listItem) {
            currentList = document.createElement(listType);
            currentListType = block.listItem;
            containerEl.appendChild(currentList);
          }
          const li = document.createElement('li');
          renderBlockContent(block, li);
          currentList.appendChild(li);
        } else {
          currentList = null;
          currentListType = null;
          
          if (block.style === 'table') {
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-responsive-wrapper';
            tableWrapper.innerHTML = block.children.map(child => child.text).join('');
            containerEl.appendChild(tableWrapper);
          } else if (block.style && /^h[1-6]$/.test(block.style)) {
            const level = block.style.substring(1);
            const h = document.createElement(`h${level}`);
            renderBlockContent(block, h);
            containerEl.appendChild(h);
          } else {
            const p = document.createElement('p');
            renderBlockContent(block, p);
            containerEl.appendChild(p);
          }
        }
      } else if (block._type === 'heading') {
        currentList = null;
        currentListType = null;
        const h = document.createElement(`h${block.level || 2}`);
        renderBlockContent(block, h);
        containerEl.appendChild(h);
      } else if (block._type === 'list') {
        currentList = null;
        currentListType = null;
        const ul = document.createElement('ul');
        block.items.forEach(itemText => {
          const li = document.createElement('li');
          li.textContent = itemText;
          ul.appendChild(li);
        });
        containerEl.appendChild(ul);
      } else {
        currentList = null;
        currentListType = null;
      }
    });
  } else {
    const p = document.createElement('p');
    p.textContent = body || '';
    containerEl.appendChild(p);
  }
}
