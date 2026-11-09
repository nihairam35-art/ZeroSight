const fs = require('fs');
const js = fs.readFileSync('app.js', 'utf8');

// Check all event listeners
const listenerMatches = js.match(/\.addEventListener\(['"]([^'"]+)['"]/g) || [];
console.log('Total addEventListener bindings:', listenerMatches.length);

// Check if all element references in `el` actually exist in `index.html`
const html = fs.readFileSync('index.html', 'utf8');
const elBlock = js.substring(js.indexOf('const el = {'), js.indexOf('};', js.indexOf('const el = {')));
const idMatches = [...elBlock.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);

console.log('Total getElementById in `el`:', idMatches.length);
const missing = idMatches.filter(id => !html.includes(`id="${id}"`));
if (missing.length > 0) {
  console.log('Missing IDs in index.html:', missing);
} else {
  console.log('✓ All getElementById IDs exist in index.html!');
}

