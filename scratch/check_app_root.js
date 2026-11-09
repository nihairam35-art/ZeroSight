const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.app-root') || l.includes('#app') || l.includes('stationary-header')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

