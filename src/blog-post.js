import { initNavigation } from './shared/navigation.js';
import { initFooter } from './shared/footer.js';
import { showToast } from './shared/toast.js';
import { renderPortableText } from './features/portable-text.js';
import { initSocialShare } from './features/social-share.js';
import { resolveAuthorAvatar } from './utils/author.js';
import { formatDate } from './utils/dates.js';
import { fetchFromSanity } from './services/sanity.js';

document.addEventListener('DOMContentLoaded', async () => {
  const postSkeleton = document.getElementById('post-reader-skeleton');
  const postContent = document.getElementById('post-reader-content');
  const errorState = document.getElementById('post-error-state');

  // DOM Elements for content injection
  const postCategory = document.getElementById('post-category');
  const postTitle = document.getElementById('post-title');
  const authorAvatar = document.getElementById('post-author-avatar');
  const authorName = document.getElementById('post-author-name');
  const authorRole = document.getElementById('post-author-role');
  const postDate = document.getElementById('post-date');
  const postReadtime = document.getElementById('post-readtime');
  const heroImage = document.getElementById('post-hero-image');
  const bodyContent = document.getElementById('post-body-content');

  // PDF Viewer DOM Elements
  const pdfViewerSection = document.getElementById('pdf-viewer-section');
  const pdfDownloadBtn = document.getElementById('pdf-download-btn');
  const pdfViewBtn = document.getElementById('pdf-view-btn');
  const pdfIframe = document.getElementById('pdf-iframe');

  // Share features
  const copyBtn = document.getElementById('share-copy-url');
  const progressIndicator = document.getElementById('reading-progress');

  // Initialize shared components
  initNavigation();
  initFooter();

  // 1. Get slug parameter from URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    showError();
    return;
  }

  // 2. Fetch the individual post from Sanity CMS
  async function loadPostData() {
    try {
      const query = `*[_type == "post" && slug.current == "${slug}"][0] {
        title,
        slug,
        publishedAt,
        readTime,
        category,
        pdfUrl,
        author->{
          name,
          role,
          "avatar": avatar.asset->url
        },
        excerpt,
        "mainImage": mainImage.asset->url,
        body
      }`;

      const post = await fetchFromSanity(query);
      const activePost = (Array.isArray(post) ? post[0] : post);

      if (!activePost) {
        showError();
        return;
      }

      renderPost(activePost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      showError();
    }
  }

  function showError() {
    postSkeleton.classList.add('hidden');
    postContent.classList.add('hidden');
    errorState.classList.remove('hidden');
  }

  // 3. Render post elements to the screen
  function renderPost(post) {
    postCategory.textContent = post.category || 'Advisory';
    postTitle.textContent = post.title;

    postDate.textContent = formatDate(post.publishedAt);
    postReadtime.textContent = post.readTime || '5 Min Read';

    const writerName = (post.author && post.author.name) || 'Katalyst Analyst';
    authorName.textContent = writerName;
    authorRole.textContent = (post.author && post.author.role) || 'Advisory Team';
    
    authorAvatar.src = resolveAuthorAvatar(writerName, post.author && post.author.avatar);
    authorAvatar.alt = writerName;

    heroImage.src = post.mainImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=600';
    heroImage.alt = post.title;

    // Build the dynamic rich text body
    renderPortableText(post.body, bodyContent);

    // Configure social share links dynamically
    initSocialShare(post.title);

    // PDF viewer integration
    if (post.pdfUrl && pdfViewerSection) {
      pdfViewerSection.classList.remove('hidden');
      if (pdfDownloadBtn) pdfDownloadBtn.href = post.pdfUrl;
      if (pdfViewBtn) pdfViewBtn.href = post.pdfUrl;
      if (pdfIframe) pdfIframe.src = post.pdfUrl;
    } else if (pdfViewerSection) {
      pdfViewerSection.classList.add('hidden');
    }

    // Toggle view from loading skeletons
    setTimeout(() => {
      postSkeleton.classList.add('hidden');
      postContent.classList.remove('hidden');
      setupReadingProgress();
    }, 600);
  }

  // 4. Scroll reading progress bar calculations
  function setupReadingProgress() {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const progressPercent = Math.min((scrollPos / docHeight) * 100, 100);
      
      if (progressIndicator) {
        progressIndicator.style.width = `${progressPercent}%`;
      }
    });
  }

  // 5. Copy URL action
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
      });
    });
  }

  await loadPostData();
});
