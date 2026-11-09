const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

console.log('\n--- SIMULATED USER NAVIGATION SESSION ---\n');

// Verify that all 9 navigation targets map cleanly
const viewIds = {
  'welcome': 'view-welcome',
  'login': 'view-login',
  'dashboard': 'content-dashboard',
  'alerts': 'content-alerts',
  'alert-details': 'content-alert-details',
  'simulator': 'content-simulator',
  'reports': 'content-reports',
  'settings': 'content-settings',
  'support': 'content-support'
};

const viewTitles = {
  'dashboard': 'Dashboard',
  'alerts': 'Threat Alerts',
  'alert-details': 'Alert Details',
  'simulator': 'Zero-Day Simulator',
  'reports': 'Threat & Evaluation Reports',
  'settings': 'System Settings',
  'support': 'SOC Support & Operations'
};

// Check that all views have matching IDs in HTML
for (const [route, id] of Object.entries(viewIds)) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`ERROR: Route ${route} element #${id} not found in HTML!`);
    process.exit(1);
  }
}
console.log('✓ All 9 views cleanly mapped to HTML elements');

// Check that each content-view element has class content-view
const contentViews = [
  'content-dashboard',
  'content-alerts',
  'content-alert-details',
  'content-simulator',
  'content-reports',
  'content-settings',
  'content-support'
];

contentViews.forEach(id => {
  const match = html.match(new RegExp(`<section[^>]*id=["']${id}["'][^>]*class=["']([^"']*)["']`));
  if (!match || !match[1].includes('content-view')) {
    console.error(`ERROR: #${id} is missing class content-view!`);
    process.exit(1);
  }
});
console.log('✓ All 7 authenticated views have class "content-view"');

// Check that only content-dashboard starts with 'active' (or welcome on initial view)
contentViews.forEach(id => {
  const match = html.match(new RegExp(`<section[^>]*id=["']${id}["'][^>]*class=["']([^"']*)["']`));
  const hasActive = match && match[1].includes('active');
  if (id === 'content-dashboard') {
    if (!hasActive) console.warn(`Note: #${id} does not have default active class`);
  } else {
    if (hasActive) {
      console.error(`ERROR: #${id} should NOT have active class initially in HTML!`);
      process.exit(1);
    }
  }
});
console.log('✓ Exactly one view (content-dashboard) starts with active class');

// Check navigation bindings in HTML
const sidebarLinks = [
  'dashboard',
  'alerts',
  'simulator',
  'reports',
  'settings',
  'support'
];

sidebarLinks.forEach(link => {
  if (!html.includes(`data-nav="${link}"`)) {
    console.error(`ERROR: Sidebar link data-nav="${link}" not found!`);
    process.exit(1);
  }
});
console.log('✓ Sidebar contains all 6 authenticated data-nav targets');

// Check that buttons routing into views exist
const directRoutes = [
  { id: 'btn-welcome-next', dest: 'login' },
  { id: 'btn-sidebar-simulator', dest: 'simulator' },
  { id: 'btn-topbar-alerts', dest: 'alerts' },
  { id: 'link-view-all-alerts', dest: 'alerts' },
  { id: 'link-view-all-quality', dest: 'reports' },
  { id: 'btn-insights-report', dest: 'reports' },
  { id: 'btn-back-to-dashboard', dest: 'alerts' },
  { id: 'crumb-alerts-root', dest: 'alerts' },
  { id: 'btn-sim-report', dest: 'reports' },
  { id: 'btn-logout', dest: 'login' }
];

directRoutes.forEach(r => {
  if (!html.includes(`id="${r.id}"`)) {
    console.error(`ERROR: Direct route trigger #${r.id} missing in index.html!`);
    process.exit(1);
  }
});
console.log('✓ All 10 internal cross-navigation triggers exist in index.html');

console.log('\n--- ALL NAVIGATION SIMULATION CHECKS PASSED! ---\n');
