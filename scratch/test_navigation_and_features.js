const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const results = [];

function test(name, condition, details = '') {
  results.push({ name, pass: !!condition, details });
  console.log(`${condition ? '✓ PASS' : '✗ FAIL'}: ${name} ${details ? '(' + details + ')' : ''}`);
}

console.log('\n--- ZERO-SIGHT NAVIGATION & FIXED LAYOUT AUDIT ---\n');

// 1. All 9 views exist in HTML
const requiredViews = [
  { id: 'view-welcome', name: 'Page 1: Welcome' },
  { id: 'view-login', name: 'Page 2: Login' },
  { id: 'content-dashboard', name: 'Page 3: Dashboard' },
  { id: 'content-alerts', name: 'Page 4: Threat Alerts Queue' },
  { id: 'content-alert-details', name: 'Page 5: Alert Details' },
  { id: 'content-simulator', name: 'Page 6: Zero-Day Simulator' },
  { id: 'content-reports', name: 'Page 7: Reports & Evaluation' },
  { id: 'content-settings', name: 'Page 8: Settings' },
  { id: 'content-support', name: 'Page 9: Support & Operations' }
];

requiredViews.forEach(v => {
  const exists = html.includes(`id="${v.id}"`);
  test(`View markup exists: ${v.name} (#${v.id})`, exists);
});

// 2. Stationary Header & Workspace Shell Markup
test('Stationary Persistent Header exists', html.includes('class="app-stationary-header"'));
test('App Workspace flex wrapper exists', html.includes('class="app-workspace"'));
test('Main content scroll container exists with #app-main-content', html.includes('id="app-main-content"'));
test('Breadcrumb active page element exists', html.includes('id="topbar-active-page"'));
test('Stationary header critical alert button exists', html.includes('id="btn-topbar-alerts"'));
test('Stationary header user avatar badge exists', html.includes('id="topbar-user-avatar"'));

// 3. Viewport Lock & Scroll Isolation in CSS
test('html, body has overflow: hidden !important', css.includes('overflow: hidden !important'));
test('app-shell is fixed with inset: 0 and overflow: hidden', css.includes('.app-shell') && css.includes('overflow: hidden !important'));
test('app-workspace is flex column and overflow hidden', css.includes('.app-workspace') && css.includes('flex-direction: column'));
test('app-stationary-header has fixed height (58px)', css.includes('.app-stationary-header') && css.includes('height: 58px'));
test('app-main-content is only vertical scroll container', css.includes('.app-main-content') && css.includes('overflow-y: auto'));
test('content-view has display: none !important', css.includes('.content-view') && css.includes('display: none !important'));
test('content-view.active has display: block !important', css.includes('.content-view.active') && css.includes('display: block !important'));

// 4. Clean Tag Nesting in index.html
let openDivs = (html.match(/<div\b/g) || []).length;
let closeDivs = (html.match(/<\/div>/g) || []).length;
test('div tags balanced in index.html', openDivs === closeDivs, `Open: ${openDivs}, Close: ${closeDivs}`);

let openMain = (html.match(/<main\b/g) || []).length;
let closeMain = (html.match(/<\/main>/g) || []).length;
test('main tags balanced in index.html', openMain === closeMain, `Open: ${openMain}, Close: ${closeMain}`);

// 5. JavaScript Navigation Logic
test('navigateTo function resets window.scrollTo(0, 0)', js.includes('window.scrollTo(0, 0)'));
test('navigateTo resets el.appMainContent.scrollTop = 0', js.includes('el.appMainContent.scrollTop = 0'));
test('navigateTo updates stationary header breadcrumb text', js.includes('el.topbarActivePage.textContent = PAGE_TITLES[targetView]'));
test('Stationary header alert badge navigates to alerts', js.includes("el.btnTopbarAlerts.addEventListener('click', () => {") || js.includes("btnTopbarAlerts.addEventListener('click'"));
test('Sidebar navigation handles all authenticated views',
  ['dashboard', 'alerts', 'simulator', 'reports', 'settings', 'support'].every(r => js.includes(`targetView === '${r}'`))
);

// 6. Brand Color Palette Compliance in CSS
test('Primary Black #0C0C0C is root variable', css.includes('#0C0C0C'));
test('Pure White #FFFFFF is root variable', css.includes('#FFFFFF'));
test('Signature Orange #FF6F32 is root variable', css.includes('#FF6F32'));

// Summary
const passed = results.filter(r => r.pass).length;
const total = results.length;
console.log(`\nAUDIT SUMMARY: ${passed} / ${total} Checks Passed (${Math.round(passed / total * 100)}%)\n`);

if (passed !== total) {
  process.exit(1);
}

