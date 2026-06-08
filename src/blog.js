import { initNavigation } from './shared/navigation.js';
import { initFooter } from './shared/footer.js';
import { resolveAuthorAvatar } from './utils/author.js';
import { formatDate } from './utils/dates.js';
import { fetchFromSanity } from './services/sanity.js';

document.addEventListener('DOMContentLoaded', async () => {
  const blogContentWrapper = document.getElementById('blog-content-wrapper');
  const blogWhitepapersGrid = document.getElementById('blog-whitepapers-grid');
  const blogBlogsGrid = document.getElementById('blog-blogs-grid');
  const whitepapersSection = document.getElementById('whitepapers-section');
  const blogsSection = document.getElementById('blogs-section');
  const blogLoadingGrid = document.getElementById('blog-loading-grid');
  const blogEmptyState = document.getElementById('blog-empty-state');
  const searchInput = document.getElementById('blog-search-input');
  const resetFiltersBtn = document.getElementById('reset-blog-filters');
  const pillsContainer = document.getElementById('category-pills-container');

  // Initialize navigation & footer
  initNavigation();
  initFooter();

  let blogPosts = [];
  let activeCategory = 'All';
  let activeSearchQuery = '';

  // 1. Fetch data from Sanity CMS
  async function loadBlogData() {
    blogLoadingGrid.classList.remove('hidden');
    blogContentWrapper.classList.add('hidden');
    blogEmptyState.classList.add('hidden');

    try {
      const query = `*[_type == "post"] | order(publishedAt desc) {
        title,
        slug,
        publishedAt,
        readTime,
        category,
        postType,
        pdfUrl,
        author->{
          name,
          role,
          "avatar": avatar.asset->url
        },
        excerpt,
        "mainImage": mainImage.asset->url
      }`;
      
      blogPosts = await fetchFromSanity(query);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    }

    setTimeout(() => {
      blogLoadingGrid.classList.add('hidden');
      blogContentWrapper.classList.remove('hidden');
      renderPosts();
    }, 600);
  }

  // 2. Render filtered posts to DOM
  function renderPosts() {
    const filtered = blogPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = 
        post.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        (post.author && post.author.name.toLowerCase().includes(activeSearchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });

    blogWhitepapersGrid.innerHTML = '';
    blogBlogsGrid.innerHTML = '';

    if (filtered.length === 0) {
      blogEmptyState.classList.remove('hidden');
      blogContentWrapper.classList.add('hidden');
      return;
    }

    blogEmptyState.classList.add('hidden');
    blogContentWrapper.classList.remove('hidden');

    const whitepapers = filtered.filter(post => post.postType === 'whitepaper');
    const blogs = filtered.filter(post => post.postType === 'blog' || !post.postType);

    if (whitepapers.length === 0) {
      whitepapersSection.classList.add('hidden');
    } else {
      whitepapersSection.classList.remove('hidden');
    }

    if (blogs.length === 0) {
      blogsSection.classList.add('hidden');
    } else {
      blogsSection.classList.remove('hidden');
    }

    whitepapers.forEach(post => {
      const card = createCardElement(post, 'Read White Paper →');
      blogWhitepapersGrid.appendChild(card);
    });

    blogs.forEach(post => {
      const card = createCardElement(post, 'Read Article →');
      blogBlogsGrid.appendChild(card);
    });
  }

  // Helper to create card element
  function createCardElement(post, actionText) {
    const card = document.createElement('article');
    card.className = 'glass-card blog-card reveal-card active';
    
    const formattedDate = formatDate(post.publishedAt);
    const imageUrl = post.mainImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=450';
    const authorName = (post.author && post.author.name) || 'Katalyst Analyst';
    const authorAvatar = resolveAuthorAvatar(authorName, post.author && post.author.avatar);

    card.innerHTML = `
      <div class="blog-card-image-wrapper">
        <img src="${imageUrl}" alt="${post.title}" class="blog-card-image" loading="lazy">
        <span class="blog-card-tag">${post.category}</span>
      </div>
      <div class="blog-card-content">
        <div class="blog-meta">
          <span class="blog-date">${formattedDate}</span>
          <span class="blog-read">${post.readTime || '5 Min Read'}</span>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-card-author-footer">
          <div class="blog-author-info">
            <img src="${authorAvatar}" alt="${authorName}" class="author-avatar-img">
            <div>
              <strong class="author-name-text">${authorName}</strong>
              <span class="author-role-text">${(post.author && post.author.role) || 'Advisory Team'}</span>
            </div>
          </div>
          ${post.postType === 'whitepaper' ? `
            <div class="blog-card-actions" style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
              <a href="./blog-post.html?slug=${post.slug.current || post.slug}" class="btn-text">${actionText}</a>
              <a href="${post.pdfUrl || '#'}" target="_blank" download class="btn-text download-btn" style="color: var(--cyan); display: inline-flex; align-items: center; gap: 4px;">
                Download PDF 📥
              </a>
            </div>
          ` : `
            <a href="./blog-post.html?slug=${post.slug.current || post.slug}" class="btn-text">${actionText}</a>
          `}
        </div>
      </div>
    `;
    return card;
  }

  // 3. Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      renderPosts();
    });
  }

  // 4. Category Pills handler
  if (pillsContainer) {
    pillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;

      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeCategory = pill.getAttribute('data-category');
      renderPosts();
    });
  }

  // 5. Reset button handler
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      activeSearchQuery = '';
      activeCategory = 'All';
      
      document.querySelectorAll('.pill').forEach(p => {
        if (p.getAttribute('data-category') === 'All') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      renderPosts();
    });
  }

  await loadBlogData();
});
