const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
];

let chromeExe = null;
for (const p of chromePaths) {
  if (p && fs.existsSync(p)) {
    chromeExe = p;
    break;
  }
}

if (!chromeExe) {
  console.error('Chrome executable not found');
  process.exit(1);
}

const indexPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');
const targetUrl = `file:///${indexPath}#welcome`;

async function main() {
  console.log('=== ZEROSIGHT FINAL FUNCTIONALITY & INTERACTION AUDIT ===\n');
  console.log('Spawning Chrome headless on debug port 9333...');

  const chromeProc = spawn(chromeExe, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9333',
    '--window-size=1440,900',
    '--user-data-dir=' + path.join(__dirname, 'chrome-temp-profile'),
    targetUrl
  ]);

  chromeProc.stderr.on('data', d => {});

  // Wait for port to be available
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const json = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9333/json/list', res => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      if (json && json.length > 0 && json[0].webSocketDebuggerUrl) {
        wsUrl = json[0].webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to get CDP WebSocket URL');
    chromeProc.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome DevTools Protocol at:', wsUrl);

  const ws = new globalThis.WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        consoleErrors.push(text);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text || 'Exception');
    }

    if (msg.id && pending.has(msg.id)) {
      const cb = pending.get(msg.id);
      pending.delete(msg.id);
      cb(msg);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.result && res.result.exceptionDetails) {
      throw new Error(res.result.exceptionDetails.text || 'Evaluation failed');
    }
    return res.result && res.result.result ? res.result.result.value : undefined;
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await new Promise(r => setTimeout(r, 800));

  const testReport = [];

  async function runStep(name, fn) {
    try {
      const detail = await fn();
      testReport.push({ name, status: 'PASS', detail: detail || 'OK' });
      console.log(`[PASS] ${name}: ${detail || 'OK'}`);
    } catch (err) {
      testReport.push({ name, status: 'FAIL', error: err.message });
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  }

  // --- SUITE 1: Welcome Page & Navigation to Login ---
  await runStep('1.1 Welcome Page Initial State', async () => {
    const isWelcomeActive = await evaluate(`document.getElementById('view-welcome').classList.contains('active')`);
    const isAppShellHidden = await evaluate(`document.getElementById('app-shell').classList.contains('hidden')`);
    if (!isWelcomeActive || !isAppShellHidden) throw new Error('Welcome page not properly active');
    return 'Welcome view active, app shell hidden';
  });

  await runStep('1.2 Welcome "Next" button click', async () => {
    await evaluate(`document.getElementById('btn-welcome-next').click()`);
    await new Promise(r => setTimeout(r, 400));
    const isLoginActive = await evaluate(`document.getElementById('view-login').classList.contains('active')`);
    const hash = await evaluate(`window.location.hash`);
    if (!isLoginActive || hash !== '#login') throw new Error(`Expected login active and hash #login, got ${hash}`);
    return 'Navigated cleanly to Login view (#login)';
  });

  // --- SUITE 2: Login Form, Password Toggle & Role Selection ---
  await runStep('2.1 Password Visibility Toggle', async () => {
    const typeBefore = await evaluate(`document.getElementById('input-password').type`);
    await evaluate(`document.getElementById('btn-toggle-password').click()`);
    const typeAfter = await evaluate(`document.getElementById('input-password').type`);
    await evaluate(`document.getElementById('btn-toggle-password').click()`); // Toggle back
    if (typeBefore !== 'password' || typeAfter !== 'text') throw new Error('Password toggle failed');
    return 'Password toggle switched from password to text and back';
  });

  await runStep('2.2 Role Selection Buttons', async () => {
    // Click Security Manager
    await evaluate(`document.querySelector('.role-option-btn[data-role="Security Manager"]').click()`);
    const role1 = await evaluate(`document.querySelector('.role-option-btn[data-role="Security Manager"]').classList.contains('active')`);
    // Click Admin
    await evaluate(`document.querySelector('.role-option-btn[data-role="Admin"]').click()`);
    const role2 = await evaluate(`document.querySelector('.role-option-btn[data-role="Admin"]').classList.contains('active')`);
    // Restore Security Analyst
    await evaluate(`document.querySelector('.role-option-btn[data-role="Security Analyst"]').click()`);
    if (!role1 || !role2) throw new Error('Role selection buttons failed active state');
    return 'Role buttons properly switch active states (Analyst/Manager/Admin)';
  });

  await runStep('2.3 Login Form Authentication & Session Propagation', async () => {
    await evaluate(`
      document.getElementById('input-username').value = 'Sarah Connor';
      document.getElementById('form-login').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await new Promise(r => setTimeout(r, 500));
    const isDashboardActive = await evaluate(`document.getElementById('content-dashboard').classList.contains('active')`);
    const hash = await evaluate(`window.location.hash`);
    const userNameDisplay = await evaluate(`document.getElementById('user-display-name').textContent`);
    const userRoleDisplay = await evaluate(`document.getElementById('user-display-role').textContent`);
    const avatarInitials = await evaluate(`document.getElementById('topbar-user-avatar').textContent`);
    if (!isDashboardActive || hash !== '#dashboard' || userNameDisplay !== 'Sarah Connor' || avatarInitials !== 'SC') {
      throw new Error(`Login propagation failed: user=${userNameDisplay}, avatar=${avatarInitials}`);
    }
    return `Logged in as Sarah Connor (${userRoleDisplay}) with initials SC`;
  });

  // --- SUITE 3: Dashboard Interactions & Charts ---
  await runStep('3.1 Dashboard Metric Cards Presence', async () => {
    const total = await evaluate(`document.querySelector('.metrics-grid .metric-card:nth-child(1) .metric-value').textContent`);
    const critical = await evaluate(`document.querySelector('.metrics-grid .metric-card:nth-child(2) .metric-value').textContent`);
    if (total !== '128' || critical !== '9') throw new Error('Metric cards values unexpected');
    return `Total alerts=${total}, Critical alerts=${critical}`;
  });

  await runStep('3.2 Alerts Over Time Dropdown Update', async () => {
    // Select yesterday
    await evaluate(`
      const sel = document.getElementById('select-chart-timerange');
      sel.value = 'yesterday';
      sel.dispatchEvent(new Event('change'));
    `);
    const yesterdayTotal = await evaluate(`document.getElementById('dashboard-total-alerts').textContent`);

    // Select 7d
    await evaluate(`
      const sel = document.getElementById('select-chart-timerange');
      sel.value = '7d';
      sel.dispatchEvent(new Event('change'));
    `);
    const sevenDayTotal = await evaluate(`document.getElementById('dashboard-total-alerts').textContent`);

    // Restore today
    await evaluate(`
      const sel = document.getElementById('select-chart-timerange');
      sel.value = 'today';
      sel.dispatchEvent(new Event('change'));
    `);
    if (yesterdayTotal !== '142' || sevenDayTotal !== '964') {
      throw new Error(`Timerange update mismatch: yesterday=${yesterdayTotal}, 7d=${sevenDayTotal}`);
    }
    return `Chart time-range updated: yesterday=142, 7d=964, today=128`;
  });

  await runStep('3.3 Risk Breakdown Donut Dropdown Update', async () => {
    await evaluate(`
      const sel = document.getElementById('select-risk-timerange');
      sel.value = '7d';
      sel.dispatchEvent(new Event('change'));
    `);
    const centerTotal = await evaluate(`document.getElementById('donut-center-total-alerts').textContent`);
    const critCount = await evaluate(`document.getElementById('donut-crit-cnt').textContent`);

    // Restore today
    await evaluate(`
      const sel = document.getElementById('select-risk-timerange');
      sel.value = 'today';
      sel.dispatchEvent(new Event('change'));
    `);
    if (centerTotal !== '964' || critCount !== '68') {
      throw new Error(`Risk donut update mismatch: total=${centerTotal}, crit=${critCount}`);
    }
    return `Donut time-range updated: 7d total=964, critical=68`;
  });

  // --- SUITE 4: Navigation Across All Sidebar Items ---
  const navTargets = [
    { nav: 'alerts', title: 'Threat Alerts Queue', heading: 'Threat Alerts' },
    { nav: 'simulator', title: 'Zero-Day Simulator', heading: 'Zero-Day Simulator' },
    { nav: 'reports', title: 'Threat & Evaluation Reports', heading: 'Threat & Evaluation Reports' },
    { nav: 'settings', title: 'SOC Settings & Configuration', heading: 'System Settings' },
    { nav: 'support', title: 'ZeroSight Support & Knowledge Base', heading: 'SOC Support & Operations' },
    { nav: 'dashboard', title: 'Good morning', heading: 'Dashboard' }
  ];

  for (const item of navTargets) {
    await runStep(`4. Sidebar Navigation -> ${item.nav}`, async () => {
      await evaluate(`document.querySelector('.nav-item[data-nav="${item.nav}"]').click()`);
      await new Promise(r => setTimeout(r, 300));
      const hash = await evaluate(`window.location.hash`);
      const topbarCrumb = await evaluate(`document.getElementById('topbar-active-page').textContent`);
      const scrollY = await evaluate(`window.scrollY`);
      if (hash !== `#${item.nav}` || topbarCrumb !== item.heading || scrollY !== 0) {
        throw new Error(`Navigation check failed: hash=${hash}, crumb=${topbarCrumb}, scrollY=${scrollY}`);
      }
      return `Navigated to #${item.nav}, stationary crumb "${item.heading}", window.scrollY=0`;
    });
  }

  // --- SUITE 5: Threat Alerts Queue Filtering, Search & Sorting ---
  await runStep('5.1 Navigate to Threat Alerts Queue', async () => {
    await evaluate(`document.querySelector('.nav-item[data-nav="alerts"]').click()`);
    await new Promise(r => setTimeout(r, 200));
    const rowsCount = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);
    if (rowsCount !== 10) throw new Error(`Expected 10 alerts in queue, found ${rowsCount}`);
    return `10 total alerts rendered in queue`;
  });

  await runStep('5.2 Severity Quick-Pills Filtering', async () => {
    // Click Critical pill
    await evaluate(`document.querySelector('.filter-pill[data-severity="critical"]').click()`);
    const critRows = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);
    // Click High pill
    await evaluate(`document.querySelector('.filter-pill[data-severity="high"]').click()`);
    const highRows = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);
    // Click All pill
    await evaluate(`document.querySelector('.filter-pill[data-severity="all"]').click()`);
    const allRows = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);
    if (critRows !== 3 || highRows !== 2 || allRows !== 10) {
      throw new Error(`Severity pill counts unexpected: crit=${critRows}, high=${highRows}, all=${allRows}`);
    }
    return `Critical pill=3 rows, High pill=2 rows, All pill=10 rows`;
  });

  await runStep('5.3 Threat Vector Category Dropdown', async () => {
    await evaluate(`
      const sel = document.getElementById('select-category-filter');
      sel.value = 'WebAttack';
      sel.dispatchEvent(new Event('change'));
    `);
    const webRows = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);

    // Restore all
    await evaluate(`
      const sel = document.getElementById('select-category-filter');
      sel.value = 'all';
      sel.dispatchEvent(new Event('change'));
    `);
    if (webRows !== 2) throw new Error(`Expected 2 WebAttack alerts, found ${webRows}`);
    return `WebAttack category filter isolated 2 rows`;
  });

  await runStep('5.4 Mitigation Status Dropdown', async () => {
    await evaluate(`
      const sel = document.getElementById('select-status-filter');
      sel.value = 'Rate Limited';
      sel.dispatchEvent(new Event('change'));
    `);
    const rateRows = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);

    // Restore all
    await evaluate(`
      const sel = document.getElementById('select-status-filter');
      sel.value = 'all';
      sel.dispatchEvent(new Event('change'));
    `);
    if (rateRows !== 2) throw new Error(`Expected 2 Rate Limited alerts, found ${rateRows}`);
    return `Rate Limited status filter isolated 2 rows`;
  });

  await runStep('5.5 Risk Score Sorting', async () => {
    await evaluate(`
      const sel = document.getElementById('select-sort-alerts');
      sel.value = 'risk-asc';
      sel.dispatchEvent(new Event('change'));
    `);
    const firstScoreAsc = await evaluate(`document.querySelector('#alerts-queue-tbody tr:first-child td:nth-child(5)').textContent`);

    await evaluate(`
      const sel = document.getElementById('select-sort-alerts');
      sel.value = 'risk-desc';
      sel.dispatchEvent(new Event('change'));
    `);
    const firstScoreDesc = await evaluate(`document.querySelector('#alerts-queue-tbody tr:first-child td:nth-child(5)').textContent`);

    if (!firstScoreAsc.includes('35') || !firstScoreDesc.includes('96')) {
      throw new Error(`Sort failed: ascFirst=${firstScoreAsc}, descFirst=${firstScoreDesc}`);
    }
    return `Sort low-high start=35, sort high-low start=96`;
  });

  await runStep('5.6 Live Text Search Filter', async () => {
    await evaluate(`
      const input = document.getElementById('input-alerts-filter');
      input.value = '172.16';
      input.dispatchEvent(new Event('input'));
    `);
    const matchCount = await evaluate(`document.querySelectorAll('#alerts-queue-tbody tr').length`);

    // Clear search
    await evaluate(`
      const input = document.getElementById('input-alerts-filter');
      input.value = '';
      input.dispatchEvent(new Event('input'));
    `);
    if (matchCount !== 2) throw new Error(`Expected 2 matches for '172.16', got ${matchCount}`);
    return `Search query '172.16' matched 2 alerts`;
  });

  // --- SUITE 6: Alert Details & Mitigation Actions ---
  await runStep('6.1 Navigate to Alert Details via "Investigate →"', async () => {
    await evaluate(`document.querySelector('#alerts-queue-tbody tr:first-child .btn-queue-investigate').click()`);
    await new Promise(r => setTimeout(r, 300));
    const isDetailsActive = await evaluate(`document.getElementById('content-alert-details').classList.contains('active')`);
    const title = await evaluate(`document.querySelector('.alert-details-title').textContent`);
    const signalsCount = await evaluate(`document.querySelectorAll('#alert-signals-container .signal-item').length`);
    const stepsCount = await evaluate(`document.querySelectorAll('#alert-steps-container .step-item').length`);
    const timelineCount = await evaluate(`document.querySelectorAll('#alert-incident-timeline .timeline-step').length`);
    if (!isDetailsActive || signalsCount < 3 || stepsCount < 2 || timelineCount !== 4) {
      throw new Error(`Details render failed: active=${isDetailsActive}, signals=${signalsCount}, steps=${stepsCount}, timeline=${timelineCount}`);
    }
    return `Details loaded for ${title} with ${signalsCount} signals, ${stepsCount} mitigation steps, and ${timelineCount} timeline events`;
  });

  await runStep('6.2 Execute Mitigation Action Step', async () => {
    const btnTextBefore = await evaluate(`document.querySelector('#alert-steps-container .step-item:first-child .btn-step-action').textContent`);
    await evaluate(`document.querySelector('#alert-steps-container .step-item:first-child .btn-step-action').click()`);
    const btnTextAfter = await evaluate(`document.querySelector('#alert-steps-container .step-item:first-child .btn-step-action').textContent`);
    if (btnTextBefore !== 'Execute' || !btnTextAfter.includes('Completed')) {
      throw new Error(`Mitigation toggle failed: before=${btnTextBefore}, after=${btnTextAfter}`);
    }
    return `Mitigation step toggled from "Execute" to "Completed ✓"`;
  });

  await runStep('6.3 Mark as False Alarm Toggle', async () => {
    const textBefore = await evaluate(`document.getElementById('btn-mark-false-alarm').textContent.trim()`);
    await evaluate(`document.getElementById('btn-mark-false-alarm').click()`);
    const textAfter = await evaluate(`document.getElementById('btn-mark-false-alarm').textContent.trim()`);
    await evaluate(`document.getElementById('btn-mark-false-alarm').click()`); // Toggle back
    if (!textAfter.includes('Marked as False Alarm')) {
      throw new Error(`False alarm toggle failed: after=${textAfter}`);
    }
    return `False alarm toggled to "Marked as False Alarm ✓" and restored`;
  });

  await runStep('6.4 "Back to alerts" button click', async () => {
    await evaluate(`document.getElementById('btn-back-to-dashboard').click()`);
    await new Promise(r => setTimeout(r, 200));
    const isAlertsActive = await evaluate(`document.getElementById('content-alerts').classList.contains('active')`);
    if (!isAlertsActive) throw new Error('Failed to return to Threat Alerts queue');
    return 'Returned cleanly to Threat Alerts view';
  });

  // --- SUITE 7: Zero-Day Simulator Launch, Reset & Rerun ---
  await runStep('7.1 Simulator Attack Selection & Baseline', async () => {
    await evaluate(`document.querySelector('.nav-item[data-nav="simulator"]').click()`);
    await new Promise(r => setTimeout(r, 200));
    const launched = await evaluate(`document.getElementById('stat-attacks-launched').textContent`);
    const caught = await evaluate(`document.getElementById('stat-attacks-caught').textContent`);
    const rate = await evaluate(`document.getElementById('stat-caught-rate').textContent`);
    if (launched !== '500' || caught !== '410' || rate !== '82%') {
      throw new Error(`Simulator baseline unexpected: launched=${launched}, caught=${caught}, rate=${rate}`);
    }
    return `Baseline verified: ${launched} launched, ${caught} caught (${rate})`;
  });

  await runStep('7.2 Launch Attack Simulation (DDoS)', async () => {
    await evaluate(`document.getElementById('btn-launch-attack').click()`);
    const isSimulating = await evaluate(`document.getElementById('btn-launch-attack').disabled`);
    if (!isSimulating) throw new Error('Launch button was not disabled with loading state');
    // Wait for simulation to finish (1.2s timeout in app.js)
    await new Promise(r => setTimeout(r, 1600));
    const launchedAfter = await evaluate(`document.getElementById('stat-attacks-launched').textContent`);
    const caughtAfter = await evaluate(`document.getElementById('stat-attacks-caught').textContent`);
    const historyRows = await evaluate(`document.querySelectorAll('#sim-history-tbody tr').length`);
    if (launchedAfter !== '550' || caughtAfter !== '451' || historyRows < 1) {
      throw new Error(`Simulation run failed: launched=${launchedAfter}, caught=${caughtAfter}, historyRows=${historyRows}`);
    }
    return `Attack completed: 550 launched, 451 caught, history row added`;
  });

  await runStep('7.3 Reset Baseline Button', async () => {
    await evaluate(`document.getElementById('btn-sim-reset').click()`);
    const launchedReset = await evaluate(`document.getElementById('stat-attacks-launched').textContent`);
    const caughtReset = await evaluate(`document.getElementById('stat-attacks-caught').textContent`);
    const rateReset = await evaluate(`document.getElementById('stat-caught-rate').textContent`);
    if (launchedReset !== '500' || caughtReset !== '410' || rateReset !== '82%') {
      throw new Error(`Reset failed: ${launchedReset}/${caughtReset} (${rateReset})`);
    }
    return 'Simulator reset to baseline: 500 launched, 410 caught, 82%';
  });

  await runStep('7.4 Rerun Simulation with WebAttack', async () => {
    await evaluate(`
      const sel = document.getElementById('select-attack-type');
      sel.value = 'WebAttack';
      sel.dispatchEvent(new Event('change'));
      document.getElementById('btn-launch-attack').click();
    `);
    await new Promise(r => setTimeout(r, 1600));
    const launchedRerun = await evaluate(`document.getElementById('stat-attacks-launched').textContent`);
    const caughtRerun = await evaluate(`document.getElementById('stat-attacks-caught').textContent`);
    if (launchedRerun !== '530' || caughtRerun !== '436') {
      throw new Error(`Rerun mismatch: launched=${launchedRerun}, caught=${caughtRerun}`);
    }
    return `Rerun completed: WebAttack added 30 pkts -> 530 launched, 436 caught`;
  });

  // --- SUITE 8: Reports, Modals & Audit Search ---
  await runStep('8.1 Navigate to Reports & Incident Audit Search', async () => {
    await evaluate(`document.querySelector('.nav-item[data-nav="reports"]').click()`);
    await new Promise(r => setTimeout(r, 200));
    const totalAuditRowsBefore = await evaluate(`document.querySelectorAll('#audit-table-body tr').length`);

    // Filter audit table
    await evaluate(`
      const inp = document.getElementById('input-audit-search');
      inp.value = 'DDoS';
      inp.dispatchEvent(new Event('input'));
    `);
    const matchCount = await evaluate(`
      Array.from(document.querySelectorAll('#audit-table-body tr')).filter(r => r.style.display !== 'none').length
    `);

    // Restore
    await evaluate(`
      const inp = document.getElementById('input-audit-search');
      inp.value = '';
      inp.dispatchEvent(new Event('input'));
    `);
    if (matchCount === 0 || matchCount >= totalAuditRowsBefore) {
      throw new Error(`Incident audit search failed: matchCount=${matchCount}`);
    }
    return `Incident audit search isolated ${matchCount} DDoS rows`;
  });

  await runStep('8.2 Export PDF Report Modal Open & Close', async () => {
    await evaluate(`document.getElementById('btn-export-report').click()`);
    const isOpen = await evaluate(`document.getElementById('modal-report-export').classList.contains('active')`);
    await evaluate(`document.getElementById('btn-modal-report-close').click()`);
    const isClosed = await evaluate(`!document.getElementById('modal-report-export').classList.contains('active')`);
    if (!isOpen || !isClosed) throw new Error('PDF Export Modal open/close failed');
    return 'PDF Export modal opened and closed cleanly';
  });

  // --- SUITE 9: Settings Persistence & LocalStorage ---
  await runStep('9.1 Settings Slider & Preset Synchronization', async () => {
    await evaluate(`document.querySelector('.nav-item[data-nav="settings"]').click()`);
    await new Promise(r => setTimeout(r, 200));

    // Click Conservative preset (75)
    await evaluate(`document.querySelector('.btn-preset[data-preset="75"]').click()`);
    const val75 = await evaluate(`document.getElementById('val-threshold').textContent`);

    // Click Aggressive preset (95)
    await evaluate(`document.querySelector('.btn-preset[data-preset="95"]').click()`);
    const val95 = await evaluate(`document.getElementById('val-threshold').textContent`);

    // Restore Balanced (85)
    await evaluate(`document.querySelector('.btn-preset[data-preset="85"]').click()`);
    if (val75 !== '75' || val95 !== '95') throw new Error(`Preset sync failed: 75=${val75}, 95=${val95}`);
    return 'Slider synced with presets: 75 Conservative, 95 Aggressive, 85 Balanced';
  });

  await runStep('9.2 Settings Webhook Ping Test', async () => {
    await evaluate(`document.getElementById('btn-test-webhook').click()`);
    const isPinging = await evaluate(`document.getElementById('btn-test-webhook').disabled`);
    await new Promise(r => setTimeout(r, 1000));
    const isRestored = await evaluate(`!document.getElementById('btn-test-webhook').disabled`);
    if (!isPinging || !isRestored) throw new Error('Webhook test ping failed');
    return 'Webhook test ping executed with simulated latency feedback';
  });

  await runStep('9.3 Save Configuration to LocalStorage', async () => {
    await evaluate(`
      document.querySelector('.btn-preset[data-preset="95"]').click();
      document.getElementById('select-model-engine').value = 'isolation-forest';
      document.getElementById('btn-save-settings').click();
    `);
    const savedStr = await evaluate(`localStorage.getItem('zerosight_settings')`);
    if (!savedStr || !savedStr.includes('95') || !savedStr.includes('isolation-forest')) {
      throw new Error(`LocalStorage save failed: ${savedStr}`);
    }
    return 'Saved configuration persisted to localStorage under zerosight_settings';
  });

  await runStep('9.4 Reset Settings Defaults', async () => {
    await evaluate(`document.getElementById('btn-reset-settings').click()`);
    const valAfter = await evaluate(`document.getElementById('val-threshold').textContent`);
    const engineAfter = await evaluate(`document.getElementById('select-model-engine').value`);
    if (valAfter !== '85' || engineAfter !== 'autoencoder') {
      throw new Error(`Reset failed: val=${valAfter}, engine=${engineAfter}`);
    }
    return 'Settings restored to 85 threshold and autoencoder engine';
  });

  // --- SUITE 10: Support Form Validation & Demonstration Tickets ---
  await runStep('10.1 Support FAQ Accordion', async () => {
    await evaluate(`document.querySelector('.nav-item[data-nav="support"]').click()`);
    await new Promise(r => setTimeout(r, 200));

    // Open first FAQ
    await evaluate(`document.querySelector('.faq-item:first-child .faq-question').click()`);
    const isOpen = await evaluate(`document.querySelector('.faq-item:first-child').classList.contains('active')`);
    // Close it
    await evaluate(`document.querySelector('.faq-item:first-child .faq-question').click()`);
    const isClosed = await evaluate(`!document.querySelector('.faq-item:first-child').classList.contains('active')`);
    if (!isOpen || !isClosed) throw new Error('FAQ Accordion toggle failed');
    return 'FAQ item expanded and collapsed cleanly';
  });

  await runStep('10.2 Documentation Playbook Modal', async () => {
    await evaluate(`document.querySelector('.btn-read-guide[data-guide="getting-started"]').click()`);
    const isDocOpen = await evaluate(`document.getElementById('modal-doc-viewer').classList.contains('active')`);
    const title = await evaluate(`document.getElementById('doc-modal-title').textContent`);
    await evaluate(`document.getElementById('btn-modal-doc-close').click()`);
    const isDocClosed = await evaluate(`!document.getElementById('modal-doc-viewer').classList.contains('active')`);
    if (!isDocOpen || !isDocClosed || !title.includes('Getting Started')) {
      throw new Error(`Doc modal failed: open=${isDocOpen}, title=${title}`);
    }
    return `Documentation viewer modal opened "${title}" and closed`;
  });

  await runStep('10.3 Support Form Client-Side Validation', async () => {
    // Attempt submit with blank subject
    await evaluate(`
      document.getElementById('ticket-subject').value = '';
      document.getElementById('ticket-desc').value = '';
      document.getElementById('form-support-ticket').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    const formVisible = await evaluate(`document.getElementById('form-support-ticket').style.display !== 'none'`);
    const successHidden = await evaluate(`document.getElementById('ticket-success-panel').classList.contains('hidden')`);
    if (!formVisible || !successHidden) throw new Error('Validation failed to reject empty form');
    return 'Empty submission rejected by client-side validation';
  });

  await runStep('10.4 Valid Support Ticket Submission & Confirmation', async () => {
    await evaluate(`
      document.getElementById('ticket-subject').value = 'Ingress DPDK Packet Latency Spike';
      document.getElementById('ticket-desc').value = 'Observed 12ms packet latency divergence during peak ingress burst on interface TenGig0.';
      document.getElementById('ticket-priority').value = 'high';
      document.getElementById('form-support-ticket').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    const isSuccessVisible = await evaluate(`!document.getElementById('ticket-success-panel').classList.contains('hidden')`);
    const refId = await evaluate(`document.getElementById('ticket-ref-id').textContent`);
    const topTicket = await evaluate(`document.querySelector('#ticket-history-tbody tr:first-child td:first-child').textContent`);
    if (!isSuccessVisible || !refId.includes('ZS-TICKET-') || topTicket !== refId) {
      throw new Error(`Ticket submission failed: success=${isSuccessVisible}, refId=${refId}, topTicket=${topTicket}`);
    }
    return `Ticket ${refId} created and added to Demonstration Tickets table`;
  });

  await runStep('10.5 Support "Create Another Ticket" Workflow', async () => {
    await evaluate(`document.getElementById('btn-ticket-create-another').click()`);
    const isFormVisible = await evaluate(`document.getElementById('form-support-ticket').style.display !== 'none'`);
    const isSuccessHidden = await evaluate(`document.getElementById('ticket-success-panel').classList.contains('hidden')`);
    if (!isFormVisible || !isSuccessHidden) throw new Error('Reset after ticket creation failed');
    return 'Form restored ready for another inquiry';
  });

  // --- SUITE 11: Application Visual & Layout Invariants ---
  await runStep('11.1 Zero Window Scroll Invariant', async () => {
    const scrollY = await evaluate(`window.scrollY`);
    const scrollX = await evaluate(`window.scrollX`);
    if (scrollY !== 0 || scrollX !== 0) throw new Error(`Unexpected window scroll: x=${scrollX}, y=${scrollY}`);
    return `window.scrollX=0, window.scrollY=0 (Desktop application-style isolation intact)`;
  });

  await runStep('11.2 Console Error Audit', async () => {
    if (consoleErrors.length > 0) {
      throw new Error(`Encountered ${consoleErrors.length} console errors: ${consoleErrors.join('; ')}`);
    }
    return '0 JavaScript console errors detected during full interactive run';
  });

  console.log('\n=========================================');
  console.log('FINAL FUNCTIONALITY AUDIT SUMMARY');
  console.log('=========================================');
  const passes = testReport.filter(t => t.status === 'PASS').length;
  const fails = testReport.filter(t => t.status === 'FAIL').length;
  console.log(`Total Interactive Tests: ${testReport.length}`);
  console.log(`Passed: ${passes}`);
  console.log(`Failed: ${fails}`);

  fs.writeFileSync(
    path.join(__dirname, 'final_audit_results.json'),
    JSON.stringify({ passed: passes, failed: fails, tests: testReport, consoleErrors }, null, 2),
    'utf8'
  );

  ws.close();
  chromeProc.kill();

  if (fails > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});

