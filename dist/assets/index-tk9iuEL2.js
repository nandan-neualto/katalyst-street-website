(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))g(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const p of n.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&g(p)}).observe(document,{childList:!0,subtree:!0});function v(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function g(i){if(i.ep)return;i.ep=!0;const n=v(i);fetch(i.href,n)}})();document.addEventListener("DOMContentLoaded",()=>{const m=document.getElementById("mobile-toggle"),s=document.querySelector(".nav-menu"),v=document.getElementById("main-nav");m&&s&&(m.addEventListener("click",()=>{m.classList.toggle("active"),s.classList.toggle("active")}),document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",()=>{m.classList.remove("active"),s.classList.remove("active")})})),window.addEventListener("scroll",()=>{window.scrollY>50?v.classList.add("scrolled"):v.classList.remove("scrolled")});const g=document.querySelectorAll(".tab-btn"),i=document.querySelectorAll(".tab-content");g.forEach(e=>{e.addEventListener("click",()=>{g.forEach(o=>o.classList.remove("active")),i.forEach(o=>o.classList.remove("active")),e.classList.add("active");const a=e.getAttribute("data-target"),t=document.getElementById(a);t&&t.classList.add("active")})});const n=document.querySelectorAll(".reveal-card, .fade-in-up");n.forEach(e=>{e.classList.add("fade-in-up")});const p=new IntersectionObserver((e,a)=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add("active"),a.unobserve(t.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});n.forEach(e=>p.observe(e));const d=document.getElementById("run-simulator");document.getElementById("simulator-svg");const I=document.getElementById("telemetry-path"),y=document.getElementById("anomaly-dot"),r=document.getElementById("tele-status"),h=document.getElementById("tele-psi"),f=document.getElementById("tele-alert"),b=document.getElementById("diagnostic-logs");let x=!1;const c=(e,a="muted")=>{const t=document.createElement("div");t.className=`log-line text-${a}`;const o=new Date().toLocaleTimeString().split(" ")[0];t.textContent=`[${o}] ${e}`,b.appendChild(t),b.scrollTop=b.scrollHeight},S=()=>{if(x)return;x=!0,d.disabled=!0,d.textContent="Analyzing...",c("Telemetry Diagnostics initiated.","info"),r.textContent="Initializing...",r.className="tele-val text-running",h.textContent="0.00",f.textContent="NONE",f.className="tele-val badge-alert-status safe",y.setAttribute("cx","-20"),y.setAttribute("cy","-20");const e=[{x:0,y:60},{x:40,y:62},{x:80,y:58},{x:120,y:64},{x:160,y:61},{x:200,y:15},{x:240,y:62},{x:280,y:59},{x:300,y:60}];let a=0,t=`M ${e[0].x},${e[0].y}`;I.setAttribute("d",t);const o=setInterval(()=>{if(a++,a<e.length){const u=e[a];t+=` L ${u.x},${u.y}`,I.setAttribute("d",t),r.textContent=`Scanning Batch ${a}/8`,a===2&&(c("Checking multi-period metadata schemas... OK.","muted"),h.textContent="0.04"),a===4&&(c("Analyzing population index variables... Stable.","muted"),h.textContent="0.08"),a===5&&(c("[WARNING]: Volumetric standard deviation breach detected in pipeline stream.","alert"),r.textContent="Outlier Detected!",r.className="tele-val text-alert",h.textContent="0.42",f.textContent="OUTLIER",f.className="tele-val badge-alert-status danger",y.setAttribute("cx",u.x.toString()),y.setAttribute("cy",u.y.toString())),a===7&&(c("[INFO]: DeltaMax auto-reconciling stream. Routing to recovery block... Success.","info"),h.textContent="0.12")}else clearInterval(o),x=!1,d.disabled=!1,d.textContent="Run Pipeline Test",r.textContent="Completed",r.className="tele-val text-done",c("Diagnostics complete. DeltaMax successfully intercepted 1 critical schema anomaly.","info")},850)};d&&d.addEventListener("click",S);const l=document.getElementById("modal-container"),L=document.getElementById("modal-close-btn"),w=document.getElementById("modal-content-target"),T={"oben-modal":`
      <div class="modal-article">
        <div class="mini-badge">Boutique Strategic Advisory</div>
        <h3>Oben Holding Group Case Study</h3>
        <div class="modal-meta">Sector: Industrial Manufacturing | Scale: 10+ Countries</div>
        <p><strong>The Challenge:</strong> Oben Holding Group, a premium multi-national packaging manufacturer headquartered in Lima, Peru, struggled to consolidate pipeline logistics data coming from independent systems across their Americas manufacturing facilities.</p>
        <p><strong>The Strategy:</strong> Katalyst Street acted as direct strategic advisors to the C-suite (CEO and CFO). We audited their legacy databases and ingestion boundaries to catalog the true architectural debt. By establishing an elegant strategy framework, we designed a unified staging blueprint on Google Cloud Platform.</p>
        <p><strong>The Solution:</strong> Leveraging Snowflake and Google BigQuery, we designed modern, light, automated ETL ingestion pipelines. Key parameters were consolidated into dynamic Vertex dashboards, providing executives with single-source visibility.</p>
        <p><strong>The Results:</strong>
          <ul>
            <li>consolidated pipeline reporting latency reduced from 6 days to real-time.</li>
            <li>Operational transport bottlenecks decreased by 22% within 90 days.</li>
            <li>Enabled C-suite to execute immediate, data-backed operational adjustments.</li>
          </ul>
        </p>
      </div>
    `,"onegame-modal":`
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
    `,"blog-1":`
      <div class="modal-article">
        <div class="mini-badge">Drift Analysis Research</div>
        <h3>Taming the "Unknown-Unknowns" in Multi-Period Ingestion Pipelines</h3>
        <div class="modal-meta">Author: Katalyst Street Tech Team | Date: May 15, 2026</div>
        <p>Traditional data validation models rely almost exclusively on strict, rigid schema checks. While this catches obvious type violations (e.g., text entering a numeric cell), it fails completely against silent, subtle data degradation—what we call the "unknown-unknowns".</p>
        <p>For example, if an upstream supplier database changes its pricing currency representation, the numbers might still parse as standard floats. Traditional filters pass the batch. However, your downstream financial predictive models are now corrupted by off-scale numbers.</p>
        <p><strong>Enter Population Stability Index (PSI):</strong>
        DeltaMax addresses this vulnerability by calculating statistical drift metrics continuously. By measuring the variance between active telemetry runs and historic baselines, it triggers anomaly alerts when distribution frequencies exceed tolerance thresholds.</p>
        <p>Implementing real-time statistical tests (T-tests, PSI calculations) within the database layer itself ensures anomalies are isolated and routed for analysis before they can contaminate downstream corporate business intelligence.</p>
      </div>
    `,"blog-2":`
      <div class="modal-article">
        <div class="mini-badge">Executive Advisory</div>
        <h3>A CEO's Blueprint to Overcoming Enterprise IT Complexity</h3>
        <div class="modal-meta">Author: Rajesh Koppula, CEO | Date: April 28, 2026</div>
        <p>In modern corporations, IT complexity operates as a hidden, highly destructive tax on growth. Every legacy database silo, custom ETL connection, and unmonitored vendor API increases friction, draining engineering hours and slowing execution speed.</p>
        <p>When the board demands immediate AI adoption, CEOs often rush to deploy ad-hoc chatbot tools or raw models directly onto disorganized database environments. This only compounds the complexity.</p>
        <p><strong>The Actionable Roadmap:</strong>
        True AI readiness requires architectural simplification. The modern CEO must:
        <ul>
          <li>Conduct a comprehensive pipeline security and friction audit.</li>
          <li>Establish a centralized data warehouse (e.g., BigQuery, Snowflake) with unified C-suite governance.</li>
          <li>Implement automated quality shields like DeltaMax to guarantee data consistency.</li>
        </ul>
        Only then can AI initiatives deliver predictable, compounding ROI.</p>
      </div>
    `,"blog-3":`
      <div class="modal-article">
        <div class="mini-badge">Cloud Security & Architecture</div>
        <h3>Integrating Vertex AI and Gemini Models Safely Within Corporate VPCs</h3>
        <div class="modal-meta">Author: Rajesh Koppula, CEO | Date: March 12, 2026</div>
        <p>Generative AI holds massive promise for corporate innovation, yet CFOs and legal teams are rightfully concerned about data compliance. Directing corporate knowledge bases through public, unverified SaaS model interfaces violates standard security protocols.</p>
        <p><strong>The Solution: Private VPC Deployments</strong>
        By utilizing authorized partners like Google Cloud, corporations can isolate advanced foundational LLMs (such as Gemini) within their secure Virtual Private Cloud (VPC) perimeters.</p>
        <p>This ensures that proprietary datasets used to tune LLMs or feed Retrieval-Augmented Generation (RAG) vector stores remain 100% private. The model operates within your secure governance boundary, eliminating data ingestion risks while unlocking full generative capacities.</p>
      </div>
    `},O=e=>{const a=T[e];a&&l&&w&&(w.innerHTML=a,l.classList.remove("hidden"),document.body.style.overflow="hidden")},A=()=>{l&&(l.classList.add("hidden"),document.body.style.overflow="auto")};document.querySelectorAll(".open-modal-btn").forEach(e=>{e.addEventListener("click",a=>{const t=e.getAttribute("data-modal");O(t)})}),L&&L.addEventListener("click",A),l&&l.addEventListener("click",e=>{e.target===l&&A()});const E=document.getElementById("consultation-form"),C=document.getElementById("toast-notification");E&&C&&E.addEventListener("submit",e=>{e.preventDefault(),C.classList.remove("hidden"),E.reset(),setTimeout(()=>{C.classList.add("hidden")},3500)});const B=document.querySelectorAll(".nav-link:not(.contact-btn)"),k=document.querySelectorAll("section[id]");window.addEventListener("scroll",()=>{let e="";const a=window.scrollY+100;k.forEach(t=>{const o=t.offsetTop,u=t.offsetHeight;a>=o&&a<o+u&&(e=t.getAttribute("id"))}),e&&B.forEach(t=>{t.classList.remove("active"),t.getAttribute("href")===`#${e}`&&t.classList.add("active")})})});
