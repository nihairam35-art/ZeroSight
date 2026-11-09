const fs = require('fs');
const js = fs.readFileSync('app.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('navigateTo(') || l.includes('topbar') || l.includes('view-') || l.includes('content-')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

