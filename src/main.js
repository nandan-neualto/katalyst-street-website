import { initNavigation } from './shared/navigation.js';
import { initFooter } from './shared/footer.js';
import { initModals } from './shared/modal.js';
import { showToast } from './shared/toast.js';
import { initDeltaMaxSimulator } from './features/deltamax-simulator.js';
import { initValidationSlider } from './features/validation-slider.js';
import { formatDate } from './utils/dates.js';
import { fetchFromSanity } from './services/sanity.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize shared components
  initNavigation();
  initFooter();
  initModals();

  // Initialize page-specific features
  initDeltaMaxSimulator();
  initValidationSlider();

  // 1. Solutions Showcase Tabs Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 2. Scroll Entrance Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-card, .fade-in-up');
  revealElements.forEach(el => {
    el.classList.add('fade-in-up');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Form Submission Intercept & Premium Toast Notifications
  const consultationForm = document.getElementById('consultation-form');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Request submitted successfully!');
      consultationForm.reset();
    });
  }

  // 4. Load homepage insights split by postType
  async function loadHomepageInsights() {
    const whitepapersGrid = document.getElementById('home-whitepapers-grid');
    const blogsGrid = document.getElementById('home-blogs-grid');
    
    if (!whitepapersGrid && !blogsGrid) return;

    try {
      if (whitepapersGrid) {
        const wpQuery = `*[_type == "post" && postType == "whitepaper"] | order(publishedAt desc) {
          title,
          slug,
          publishedAt,
          readTime,
          category,
          excerpt,
          pdfUrl
        }`;
        const whitepapers = await fetchFromSanity(wpQuery);
        whitepapersGrid.innerHTML = '';
        whitepapers.slice(0, 2).forEach(post => {
          const card = document.createElement('article');
          card.className = 'glass-card blog-card reveal-card active';
          const formattedDate = formatDate(post.publishedAt);
          
          card.innerHTML = `
            <div class="blog-meta">
              <span class="blog-date">${formattedDate}</span>
              <span class="blog-read">${post.readTime || '5 Min Read'}</span>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="${post.pdfUrl || `./blog-post.html?slug=${post.slug.current || post.slug}`}" ${post.pdfUrl ? 'target="_blank"' : ''} class="btn-text">Read White Paper →</a>
          `;
          whitepapersGrid.appendChild(card);
        });
      }

      if (blogsGrid) {
        const blogQuery = `*[_type == "post" && postType == "blog"] | order(publishedAt desc) {
          title,
          slug,
          publishedAt,
          readTime,
          category,
          excerpt
        }`;
        const blogs = await fetchFromSanity(blogQuery);
        blogsGrid.innerHTML = '';
        blogs.slice(0, 3).forEach(post => {
          const card = document.createElement('article');
          card.className = 'glass-card blog-card reveal-card active';
          const formattedDate = formatDate(post.publishedAt);
          
          card.innerHTML = `
            <div class="blog-meta">
              <span class="blog-date">${formattedDate}</span>
              <span class="blog-read">${post.readTime || '5 Min Read'}</span>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="./blog-post.html?slug=${post.slug.current || post.slug}" class="btn-text">Read Article →</a>
          `;
          blogsGrid.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Error loading homepage insights:', error);
    }
  }

  loadHomepageInsights();
});
