const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ name, pass: true });
    console.log(`[PASS] ${name}`);
  } catch (err) {
    results.push({ name, pass: false, error: err.message });
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

console.log('=== ZEROSIGHT FRONTEND VERIFICATION SUITE ===\n');

// 1. Structural Verification of index.html
test('Index.html: All 9 page views exist with correct IDs', () => {
  const views = [
    'view-welcome',
    'view-login',
    'content-dashboard',
    'content-alerts',
    'content-alert-details',
    'content-simulator',
    'content-reports',
    'content-settings',
    'content-support'
  ];
  views.forEach(v => {
    assert(html.includes(`id="${v}"`), `Missing view element #${v}`);
  });
});

test('Index.html: Stationary App Shell layout present', () => {
  assert(html.includes('id="app-shell"'), 'Missing #app-shell');
  assert(html.includes('id="app-sidebar"'), 'Missing #app-sidebar');
  assert(html.includes('class="app-stationary-header"'), 'Missing app-stationary-header');
  assert(html.includes('id="topbar-active-page"'), 'Missing #topbar-active-page');
});

test('Index.html: Threat Alerts filter controls exist', () => {
  assert(html.includes('id="select-sort-alerts"'), 'Missing #select-sort-alerts');
  assert(html.includes('id="input-alerts-filter"'), 'Missing #input-alerts-filter');
  assert(html.includes('id="pill-cnt-critical"'), 'Missing #pill-cnt-critical');
  assert(html.includes('id="pill-cnt-high"'), 'Missing #pill-cnt-high');
  assert(html.includes('id="pill-cnt-medium"'), 'Missing #pill-cnt-medium');
  assert(html.includes('id="pill-cnt-low"'), 'Missing #pill-cnt-low');
  assert(!html.includes('id="pill-cnt-all"'), 'pill-cnt-all should be removed');
  assert(!html.includes('id="select-category-filter"'), 'select-category-filter should be removed');
  assert(!html.includes('id="select-status-filter"'), 'select-status-filter should be removed');
});

test('Index.html: Alert Details dynamic containers exist', () => {
  assert(html.includes('id="alert-signals-container"'), 'Missing #alert-signals-container');
  assert(html.includes('id="alert-steps-container"'), 'Missing #alert-steps-container');
  assert(html.includes('id="alert-incident-timeline"'), 'Missing #alert-incident-timeline');
  assert(html.includes('id="other-alerts-title"'), 'Missing #other-alerts-title');
  assert(html.includes('id="other-alerts-list"'), 'Missing #other-alerts-list');
  assert(html.includes('id="btn-mark-false-alarm"'), 'Missing #btn-mark-false-alarm');
});

test('Index.html: Zero-Day Simulator controls, reset & run history exist', () => {
  assert(html.includes('id="select-attack-type"'), 'Missing #select-attack-type');
  assert(html.includes('id="btn-launch-attack"'), 'Missing #btn-launch-attack');
  assert(html.includes('id="btn-sim-reset"'), 'Missing #btn-sim-reset');
  assert(html.includes('id="sim-history-tbody"'), 'Missing #sim-history-tbody');
  assert(html.includes('id="btn-clear-sim-history"'), 'Missing #btn-clear-sim-history');
});

test('Index.html: Dashboard time-range controls exist', () => {
  assert(html.includes('id="select-chart-timerange"'), 'Missing #select-chart-timerange');
  assert(html.includes('id="select-risk-timerange"'), 'Missing #select-risk-timerange');
  assert(html.includes('id="dashboard-total-alerts"'), 'Missing #dashboard-total-alerts');
});

test('Index.html: Settings persistence controls exist', () => {
  assert(html.includes('id="slider-threshold"'), 'Missing #slider-threshold');
  assert(html.includes('id="val-threshold"'), 'Missing #val-threshold');
  assert(html.includes('id="switch-auto-quarantine"'), 'Missing #switch-auto-quarantine');
  assert(html.includes('id="btn-save-settings"'), 'Missing #btn-save-settings');
  assert(html.includes('id="btn-reset-settings"'), 'Missing #btn-reset-settings');
  assert(html.includes('id="btn-test-webhook"'), 'Missing #btn-test-webhook');
});

test('Index.html: Support Center validation & demonstration ticket history exist', () => {
  assert(html.includes('id="form-support-ticket"'), 'Missing #form-support-ticket');
  assert(html.includes('id="ticket-subject"'), 'Missing #ticket-subject');
  assert(html.includes('id="ticket-desc"'), 'Missing #ticket-desc');
  assert(html.includes('id="ticket-success-panel"'), 'Missing #ticket-success-panel');
  assert(html.includes('id="ticket-ref-id"'), 'Missing #ticket-ref-id');
  assert(html.includes('id="ticket-history-tbody"'), 'Missing #ticket-history-tbody');
  assert(html.includes('id="btn-clear-tickets"'), 'Missing #btn-clear-tickets');
  assert(html.includes('id="btn-run-diagnostics"'), 'Missing #btn-run-diagnostics');
});

// 2. CSS Brand Palette & Rule Verification
test('Styles.css: Official Brand Palette compliance (#0C0C0C, #FFFFFF, #FF6F32)', () => {
  assert(css.includes('#0C0C0C') || css.includes('#0c0c0c'), 'Missing #0C0C0C brand black');
  assert(css.includes('#FFFFFF') || css.includes('#ffffff'), 'Missing #FFFFFF brand white');
  assert(css.includes('#FF6F32') || css.includes('#ff6f32'), 'Missing #FF6F32 brand orange');
  assert(css.includes('--primary-black'), 'Missing --primary-black variable');
  assert(css.includes('--pure-white'), 'Missing --pure-white variable');
  assert(css.includes('--signature-orange'), 'Missing --signature-orange variable');
});

test('Styles.css: Viewport isolation and non-scrollable shell', () => {
  assert(css.includes('.app-shell'), 'Missing .app-shell class');
  assert(css.includes('.app-stationary-header'), 'Missing .app-stationary-header class');
  assert(css.includes('.incident-timeline-card'), 'Missing .incident-timeline-card class');
  assert(css.includes('.timeline-trail'), 'Missing .timeline-trail class');
  assert(css.includes('.timeline-marker'), 'Missing .timeline-marker class');
});

// 3. JS Logic Verification
test('App.js: Alerts repository has 10 comprehensive realistic items', () => {
  const match = js.match(/const ALERTS_DATA = (\[[\s\S]*?\]);\s*\n\s*\/\/ Default Simulation History/);
  assert(match, 'Failed to extract ALERTS_DATA from app.js');
  const alerts = eval(match[1]);
  assert(Array.isArray(alerts), 'ALERTS_DATA must be an array');
  assert(alerts.length === 10, `Expected 10 alerts, got ${alerts.length}`);
  alerts.forEach(a => {
    assert(a.id && a.type && a.ip && a.score && a.severity && a.status, `Alert ${a.id} missing required fields`);
    assert(Array.isArray(a.signals) && a.signals.length >= 3, `Alert ${a.id} must have >= 3 signals`);
    assert(Array.isArray(a.steps) && a.steps.length >= 2, `Alert ${a.id} must have >= 2 mitigation steps`);
    assert(Array.isArray(a.timeline) && a.timeline.length === 4, `Alert ${a.id} must have 4 chronological timeline events`);
  });
});

test('App.js: Simulation scenario presets for all 5 attack vectors', () => {
  assert(js.includes("DDoS: { name: 'DDoS Flood'"), 'Missing DDoS scenario preset');
  assert(js.includes("WebAttack: { name: 'WebAttack SQLi'"), 'Missing WebAttack scenario preset');
  assert(js.includes("PortScan: { name: 'PortScan Sweep'"), 'Missing PortScan scenario preset');
  assert(js.includes("Infiltration: { name: 'Infiltration Kerberos'"), 'Missing Infiltration scenario preset');
  assert(js.includes("Botnet: { name: 'Botnet C2 Beacon'"), 'Missing Botnet scenario preset');
});

test('App.js: LocalStorage keys properly wired', () => {
  assert(js.includes("'zerosight_settings'"), 'Missing zerosight_settings localStorage key');
  assert(js.includes("'zerosight_tickets'"), 'Missing zerosight_tickets localStorage key');
  assert(js.includes("'zerosight_sim_history'"), 'Missing zerosight_sim_history localStorage key');
});

test('App.js: Hash routing and page isolation intact', () => {
  assert(js.includes("function navigateTo(targetView)"), 'Missing navigateTo function');
  assert(js.includes("window.location.hash"), 'Missing hash location listener');
  assert(js.includes("renderAlertsQueue"), 'Missing renderAlertsQueue hook in router');
  assert(js.includes("renderAlertDetails"), 'Missing renderAlertDetails hook in router');
  assert(js.includes("renderSimulator"), 'Missing renderSimulator hook in router');
});

console.log('\n=== SUMMARY ===');
const passed = results.filter(r => r.pass).length;
const total = results.length;
console.log(`Passed: ${passed}/${total}`);
if (passed === total) {
  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!\n');
} else {
  console.error(`FAILED ${total - passed} CHECKS!\n`);
  process.exit(1);
}
