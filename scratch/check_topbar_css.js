const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.match(/(btn-notification-badge|btn-card-toggle|theme-mode-switcher|date-badge|dashboard-header)/)) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

