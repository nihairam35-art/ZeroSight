const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.match(/^\s*(\.metrics-grid|\.charts-row|\.tri-grid-row|\.alert-stats-grid|\.sim-stats-grid)\s*\{/)) {
    console.log(`${i+1}: ${lines.slice(i, i+15).join('\n')}\n---`);
  }
});

