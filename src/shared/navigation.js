export function initNavigation() {
  const navbar = document.getElementById('main-nav');
  if (!navbar) return;

  const pathname = window.location.pathname;
  // Home page detection, supporting local vite paths and trailing slash
  const isHome = pathname === '/' || pathname.endsWith('index.html') || pathname === '' || pathname.endsWith('/');

  // Inject navbar HTML
  navbar.innerHTML = `
    <div class="nav-container">
      <a href="${isHome ? '#home' : './index.html#home'}" class="logo">
        <img src="/images/brand/katalyst_street_icon_brand.png" alt="Katalyst Street Icon" class="logo-icon">
        <span class="logo-text">Katalyst <span class="accent-text">Street</span></span>
      </a>

      <!-- Desktop Links -->
      <nav class="nav-menu">
        <a href="${isHome ? '#home' : './index.html#home'}" class="nav-link" id="nav-home">Home</a>
        <a href="${isHome ? '#partners' : './index.html#partners'}" class="nav-link" id="nav-partners">Partners</a>
        <a href="${isHome ? '#services' : './index.html#services'}" class="nav-link" id="nav-services">Advisory</a>
        <a href="${isHome ? '#solutions' : './index.html#solutions'}" class="nav-link" id="nav-solutions">Solutions</a>
        <a href="${isHome ? '#approach' : './index.html#approach'}" class="nav-link" id="nav-approach">Our Approach</a>
        <a href="${isHome ? '#customers' : './index.html#customers'}" class="nav-link" id="nav-customers">Customers</a>
        <a href="./blog.html" class="nav-link" id="nav-insights">Insights</a>
        <a href="${isHome ? '#contact' : './index.html#contact'}" class="nav-link contact-btn" id="nav-contact">Get in Touch</a>
      </nav>

      <!-- Mobile Hamburger Button -->
      <button class="mobile-toggle" id="mobile-toggle" aria-label="Toggle navigation menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  // Highlight active link based on current page
  if (isHome) {
    document.getElementById('nav-home')?.classList.add('active');
  } else if (pathname.includes('blog.html')) {
    document.getElementById('nav-insights')?.classList.add('active');
  } else if (pathname.includes('blog-post.html')) {
    document.getElementById('nav-insights')?.classList.add('active');
  }

  // Hamburger menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = navbar.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ScrollSpy active link synchronization for homepage
  if (isHome) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = navbar.querySelectorAll('.nav-link:not(.contact-btn)');

    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPosition = window.scrollY + 100;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      if (currentId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${currentId}` || href === `./index.html#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}
