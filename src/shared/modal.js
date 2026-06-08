const modalDatabase = {
  'oben-modal': `
    <div class="modal-article">
      <div class="mini-badge">Boutique Strategic Advisory</div>
      <h3>Oben Holding Group Case Study</h3>
      <div class="modal-meta">Sector: Industrial Manufacturing | Scale: 10+ Countries</div>
      <p><strong>The Challenge:</strong> Oben Holding Group, a premium multi-national packaging manufacturer headquartered in Lima, Peru, struggled to consolidate pipeline logistics data coming from independent systems across their Americas manufacturing facilities.</p>
      <p><strong>The Strategy:</strong> Katalyst Street acted as direct strategic advisors to the C-suite (CEO and CFO). We audited their legacy databases and ingestion boundaries to catalog the true architectural debt. By establishing an elegant strategy framework, we designed a unified staging blueprint on Google Cloud Platform.</p>
      <p><strong>The Solution:</strong> Leveraging Snowflake and Google BigQuery, we designed modern, light, automated ETL ingestion pipelines. Key parameters were consolidated into dynamic Vertex dashboards, providing executives with single-source visibility.</p>
      <p><strong>The Results:</strong>
        <ul>
          <li>Consolidated pipeline reporting latency reduced from 6 days to real-time.</li>
          <li>Operational transport bottlenecks decreased by 22% within 90 days.</li>
          <li>Enabled C-suite to execute immediate, data-backed operational adjustments.</li>
        </ul>
      </p>
    </div>
  `,
  'onegame-modal': `
    <div class="modal-article">
      <div class="mini-badge">AI Foundational Engineering</div>
      <h3>OneGame Chatbot Blueprint</h3>
      <div class="modal-meta">Sector: Immersive Gaming & AI | Scale: Global Platform</div>
      <p><strong>The Challenge:</strong> OneGame wanted to leverage modern Generative AI to boost gamer engagement and automate player support. Traditional rule-based chatbots felt synthetic and led to high exit rates.</p>
      <p><strong>The Strategy:</strong> Katalyst Street drove the foundational AI research. We conducted custom LLM parameters workshops to define appropriate tone, moderation layers, and integration triggers matching gaming contexts.</p>
      <p><strong>The Solution:</strong> We designed a secure, low-latency chatbot architecture utilizing Google Cloud Vertex AI and highly responsive custom Gemini models, isolated within secure virtual boundary structures to prevent database toxicity.</p>
      <p><strong>The Results:</strong>
        <ul>
          <li>Achieved a 45% lift in gamer chat duration and community engagement.</li>
          <li>Reduced technical support ticket queues by 60% through instant automated troubleshooting.</li>
          <li>Delivered a robust, modular roadmap for future multi-agent gaming frameworks.</li>
        </ul>
      </p>
    </div>
  `
};

export function initModals() {
  const modalContainer = document.getElementById('modal-container');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContentTarget = document.getElementById('modal-content-target');

  if (!modalContainer || !modalContentTarget) return;

  const openModal = (targetId) => {
    const htmlContent = modalDatabase[targetId];
    if (htmlContent) {
      modalContentTarget.innerHTML = htmlContent;
      modalContainer.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
  };

  const closeModal = () => {
    modalContainer.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Resume scrolling
  };

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal');
      openModal(targetId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
}
