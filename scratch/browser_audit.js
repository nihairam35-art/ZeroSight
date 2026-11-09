const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9333; // Use clean custom port
const SERVER_PORT = 3100; // Use clean custom server port

// 1. Start HTTP Server
const PUBLIC_DIR = path.resolve(__dirname, '..');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// CDP Client using native Node 24 WebSocket
class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
    await sleep(200);
  }

  async captureScreenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved screenshot: ${path.basename(filePath)} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }

  async click(selector) {
    await this.eval(`(() => {
      const el = document.querySelector('${selector}');
      if (!el) throw new Error('Element not found: ${selector}');
      el.click();
    })()`);
    await sleep(350);
  }
}

async function runAudit() {
  console.log('--- STARTING REAL-BROWSER AUDIT & SCREENSHOT SUITE ---');

  // Start internal web server
  await new Promise(resolve => server.listen(SERVER_PORT, resolve));
  console.log(`HTTP Server listening on http://localhost:${SERVER_PORT}`);

  // Create clean user data dir
  const userDataDir = path.join(PUBLIC_DIR, 'scratch', 'chrome_temp_profile');
  if (fs.existsSync(userDataDir)) {
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) { }
  }
  fs.mkdirSync(userDataDir, { recursive: true });

  // Spawn Chrome
  console.log(`Spawning Google Chrome headless: ${CHROME_PATH}`);
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `http://localhost:${SERVER_PORT}`
  ]);

  chromeProc.on('error', (err) => console.error('Chrome spawn error:', err));

  // Wait for remote debugging endpoint to become available
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://localhost:${DEBUG_PORT}/json`);
      if (res.ok) {
        const pages = await res.json();
        const targetPage = pages.find(p => p.type === 'page' && p.url.includes(`localhost:${SERVER_PORT}`));
        if (targetPage && targetPage.webSocketDebuggerUrl) {
          wsUrl = targetPage.webSocketDebuggerUrl;
          break;
        }
      }
    } catch (e) { }
  }

  if (!wsUrl) {
    console.error('Failed to connect to Chrome debugging endpoint!');
    chromeProc.kill();
    server.close();
    process.exit(1);
  }

  console.log('Connected to Chrome DevTools Protocol:', wsUrl);
  const session = new CdpSession(wsUrl);
  await session.connect();

  // Enable necessary domains
  await session.send('Page.enable');
  await session.send('Runtime.enable');
  await session.send('DOM.enable');

  // Default viewport: 1920x1080 Full HD Desktop
  await session.setViewport(1920, 1080);
  await sleep(600);

  const auditReport = [];

  async function checkLayout(pageName) {
    const metrics = await session.eval(`(() => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const mainContent = document.getElementById('app-main-content');
      const mainScrollTop = mainContent ? mainContent.scrollTop : 0;
      const mainScrollHeight = mainContent ? mainContent.scrollHeight : 0;
      const mainClientHeight = mainContent ? mainContent.clientHeight : 0;

      // Find any elements overflowing horizontally
      const allEls = Array.from(document.querySelectorAll('*'));
      const overflowing = allEls.filter(el => {
        // Exclude document root and body
        if (el === document.documentElement || el === document.body || el.id === 'app') return false;
        return el.scrollWidth > el.clientWidth && el.clientWidth > 0 && window.getComputedStyle(el).overflowX === 'visible';
      }).map(el => el.className || el.tagName);

      return {
        docHeight,
        winHeight,
        scrollY,
        scrollX,
        mainScrollTop,
        mainScrollHeight,
        mainClientHeight,
        windowScrollLocked: scrollY === 0 && scrollX === 0,
        docHeightEqualsWinHeight: Math.abs(docHeight - winHeight) <= 1,
        overflowingCount: overflowing.length,
        overflowingSummary: overflowing.slice(0, 3).join(', ')
      };
    })()`);

    auditReport.push({ page: pageName, ...metrics });
    return metrics;
  }

  // ==========================================
  // PAGE 1: WELCOME SCREEN
  // ==========================================
  console.log('\n--- Auditing Page 1: Welcome ---');
  await session.eval(`navigateTo('welcome')`);
  await sleep(400);
  await checkLayout('Page 1: Welcome');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page1_welcome.png'));

  // ==========================================
  // PAGE 2: LOGIN SCREEN
  // ==========================================
  console.log('\n--- Auditing Page 2: Login ---');
  await session.click('#btn-welcome-next');
  await sleep(400);
  await checkLayout('Page 2: Login');
  // Type username and select role
  await session.eval(`(() => {
    document.getElementById('input-username').value = 'Alex Mercer';
    const roleBtn = document.querySelector('.role-option-btn[data-role=\"Security Analyst\"]');
    if (roleBtn) roleBtn.click();
  })()`);
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page2_login.png'));

  // ==========================================
  // PAGE 3: DASHBOARD
  // ==========================================
  console.log('\n--- Auditing Page 3: Dashboard ---');
  await session.click('#btn-login-submit');
  await sleep(500);
  await checkLayout('Page 3: Dashboard');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page3_dashboard.png'));

  // ==========================================
  // PAGE 4: THREAT ALERTS QUEUE
  // ==========================================
  console.log('\n--- Auditing Page 4: Threat Alerts Queue ---');
  await session.click('.nav-item[data-nav=\"alerts\"]');
  await sleep(400);
  await checkLayout('Page 4: Threat Alerts Queue');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page4_alerts.png'));

  // ==========================================
  // PAGE 5: ALERT DETAILS
  // ==========================================
  console.log('\n--- Auditing Page 5: Alert Details ---');
  await session.click('.btn-queue-investigate');
  await sleep(400);
  await checkLayout('Page 5: Alert Details');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page5_alert_details.png'));

  // ==========================================
  // PAGE 6: ZERO-DAY SIMULATOR
  // ==========================================
  console.log('\n--- Auditing Page 6: Zero-Day Simulator ---');
  await session.click('.nav-item[data-nav=\"simulator\"]');
  await sleep(400);
  // Launch attack simulation
  await session.click('#btn-launch-attack');
  await sleep(600);
  await checkLayout('Page 6: Zero-Day Simulator');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page6_simulator.png'));

  // ==========================================
  // PAGE 7: REPORTS & EVALUATION
  // ==========================================
  console.log('\n--- Auditing Page 7: Reports & Evaluation ---');
  await session.click('.nav-item[data-nav=\"reports\"]');
  await sleep(400);
  await checkLayout('Page 7: Reports & Evaluation');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page7_reports.png'));

  // ==========================================
  // PAGE 8: SYSTEM SETTINGS
  // ==========================================
  console.log('\n--- Auditing Page 8: System Settings ---');
  await session.click('.nav-item[data-nav=\"settings\"]');
  await sleep(400);
  await checkLayout('Page 8: System Settings');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page8_settings.png'));

  // ==========================================
  // PAGE 9: SUPPORT & OPERATIONS
  // ==========================================
  console.log('\n--- Auditing Page 9: Support & Operations ---');
  await session.click('.nav-item[data-nav=\"support\"]');
  await sleep(400);
  await checkLayout('Page 9: Support & Operations');
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'page9_support.png'));

  // ==========================================
  // RESPONSIVE VIEWPORT CHECKS
  // ==========================================
  console.log('\n--- Auditing Responsive Viewports ---');

  // Laptop 1440x900
  await session.setViewport(1440, 900);
  await session.eval(`navigateTo('dashboard')`);
  await sleep(350);
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'responsive_laptop_1440.png'));

  // Tablet Landscape 1024x768
  await session.setViewport(1024, 768);
  await sleep(350);
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'responsive_tablet_1024.png'));

  // Tablet Portrait 768x1024 (with mobile drawer open)
  await session.setViewport(768, 1024);
  await session.eval(`openMobileSidebar()`);
  await sleep(350);
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'responsive_tablet_768_drawer.png'));
  await session.eval(`closeMobileSidebar()`);
  await sleep(250);

  // Mobile 375x812 (iPhone X/12/13/14 format)
  await session.setViewport(375, 812);
  await sleep(350);
  await session.captureScreenshot(path.join(ARTIFACT_DIR, 'responsive_mobile_375.png'));

  // Save audit report JSON
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'scratch', 'browser_audit_results.json'),
    JSON.stringify(auditReport, null, 2)
  );

  console.log('\n--- BROWSER AUDIT COMPLETE ---');
  console.table(auditReport.map(r => ({
    Page: r.page,
    'Doc Height': `${r.docHeight}px`,
    'Win Height': `${r.winHeight}px`,
    'Window Scroll Locked': r.windowScrollLocked ? 'YES' : 'NO',
    'Main Scrollable': r.mainScrollHeight > r.mainClientHeight ? 'YES' : 'NO (Fits)'
  })));

  // Clean exit
  try { chromeProc.kill(); } catch (e) { }
  server.close();
  process.exit(0);
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
