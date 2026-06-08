export function initFooter() {
  const footer = document.querySelector('footer.site-footer');
  if (!footer) return;

  const pathname = window.location.pathname;
  const isHome = pathname === '/' || pathname.endsWith('index.html') || pathname === '' || pathname.endsWith('/');

  footer.innerHTML = `
    <div class="container footer-grid">
      <div class="footer-brand">
        <div class="logo">
          <img src="/images/brand/katalyst_street_icon_white.png" alt="Katalyst Street Icon" class="logo-icon">
          <span class="logo-text">Katalyst <span class="accent-text">Street</span></span>
        </div>
        <p class="footer-tagline">Taming IT Complexity. Building the AI Future.</p>
      </div>
      <div class="footer-links">
        <div class="link-group">
          <h4>Navigation</h4>
          <a href="${isHome ? '#home' : './index.html#home'}">Home</a>
          <a href="${isHome ? '#services' : './index.html#services'}">Advisory</a>
          <a href="${isHome ? '#solutions' : './index.html#solutions'}">Solutions</a>
          <a href="${isHome ? '#approach' : './index.html#approach'}">Our Approach</a>
        </div>
        <div class="link-group">
          <h4>Resources</h4>
          <a href="${isHome ? '#customers' : './index.html#customers'}">Customers</a>
          <a href="./blog.html">Insights</a>
          <a href="${isHome ? '#team' : './index.html#team'}">Leadership Team</a>
        </div>
        <div class="link-group">
          <h4>Partner Context</h4>
          <a href="https://console.cloud.google.com/marketplace?hl=en" target="_blank">GCP Marketplace</a>
          <a href="https://www.linkedin.com/company/96600014/" target="_blank">LinkedIn Profile</a>
        </div>
      </div>
    </div>
    <div class="container footer-copy">
      <p>&copy; ${new Date().getFullYear()} by Katalyst Street, Inc. All rights reserved.</p>
    </div>
  `;
}
