const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('btn-mobile-menu')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

