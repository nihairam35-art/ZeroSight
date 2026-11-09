const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<main') || l.includes('</main>') || l.includes('app-workspace') || l.includes('id="app-shell"') || l.includes('id="app"')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

