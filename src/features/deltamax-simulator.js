export function initDeltaMaxSimulator() {
  const runSimBtn = document.getElementById('run-simulator');
  const simulatorSvg = document.getElementById('simulator-svg');
  const telemetryPath = document.getElementById('telemetry-path');
  const anomalyDot = document.getElementById('anomaly-dot');
  
  const statusEl = document.getElementById('tele-status');
  const psiEl = document.getElementById('tele-psi');
  const alertEl = document.getElementById('tele-alert');
  const logsContainer = document.getElementById('diagnostic-logs');

  if (!runSimBtn || !simulatorSvg || !telemetryPath || !anomalyDot || !statusEl || !psiEl || !alertEl || !logsContainer) {
    return;
  }

  let simulatorRunning = false;

  const appendLog = (text, type = 'muted') => {
    const line = document.createElement('div');
    line.className = `log-line text-${type}`;
    const time = new Date().toLocaleTimeString().split(' ')[0];
    line.textContent = `[${time}] ${text}`;
    logsContainer.appendChild(line);
    logsContainer.scrollTop = logsContainer.scrollHeight;
  };

  const runTelemetryDiagnostic = () => {
    if (simulatorRunning) return;
    simulatorRunning = true;
    runSimBtn.disabled = true;
    runSimBtn.textContent = 'Analyzing...';
    
    // Reset state & values
    appendLog('Telemetry Diagnostics initiated.', 'info');
    statusEl.textContent = 'Initializing...';
    statusEl.className = 'tele-val text-running';
    psiEl.textContent = '0.00';
    alertEl.textContent = 'NONE';
    alertEl.className = 'tele-val badge-alert-status safe';
    
    // Hide anomaly indicator dot
    anomalyDot.setAttribute('cx', '-20');
    anomalyDot.setAttribute('cy', '-20');
    
    // Telemetry path coordinate generator points
    const points = [
      { x: 0, y: 60 },
      { x: 40, y: 62 },
      { x: 80, y: 58 },
      { x: 120, y: 64 },
      { x: 160, y: 61 },
      { x: 200, y: 15 },  // Outlier anomaly spike point
      { x: 240, y: 62 },
      { x: 280, y: 59 },
      { x: 300, y: 60 }
    ];

    let step = 0;
    let pathD = `M ${points[0].x},${points[0].y}`;
    telemetryPath.setAttribute('d', pathD);

    const interval = setInterval(() => {
      step++;
      if (step < points.length) {
        const p = points[step];
        pathD += ` L ${p.x},${p.y}`;
        telemetryPath.setAttribute('d', pathD);
        
        statusEl.textContent = `Scanning Batch ${step}/8`;
        
        // Dynamic logs based on position
        if (step === 2) {
          appendLog('Checking multi-period metadata schemas... OK.', 'muted');
          psiEl.textContent = '0.04';
        }
        if (step === 4) {
          appendLog('Analyzing population index variables... Stable.', 'muted');
          psiEl.textContent = '0.08';
        }
        if (step === 5) {
          appendLog('[WARNING]: Volumetric standard deviation breach detected in pipeline stream.', 'alert');
          statusEl.textContent = 'Outlier Detected!';
          statusEl.className = 'tele-val text-alert';
          psiEl.textContent = '0.42'; // Exceeded typical 0.2 threshold!
          
          // Flash anomaly alert
          alertEl.textContent = 'OUTLIER';
          alertEl.className = 'tele-val badge-alert-status danger';
          
          // Display red pulsing outlier dot on SVG
          anomalyDot.setAttribute('cx', p.x.toString());
          anomalyDot.setAttribute('cy', p.y.toString());
        }
        if (step === 7) {
          appendLog('[INFO]: DeltaMax auto-reconciling stream. Routing to recovery block... Success.', 'info');
          psiEl.textContent = '0.12';
        }
      } else {
        // Diagnostic finish
        clearInterval(interval);
        simulatorRunning = false;
        runSimBtn.disabled = false;
        runSimBtn.textContent = 'Run Pipeline Test';
        
        statusEl.textContent = 'Completed';
        statusEl.className = 'tele-val text-done';
        
        appendLog('Diagnostics complete. DeltaMax successfully intercepted 1 critical schema anomaly.', 'info');
      }
    }, 850);
  };

  runSimBtn.addEventListener('click', runTelemetryDiagnostic);
}
