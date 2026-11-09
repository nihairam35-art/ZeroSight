const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');

let openBraces = 0;
let closeBraces = 0;

for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') openBraces++;
  if (css[i] === '}') closeBraces++;
}

console.log(`Open braces: ${openBraces}, Close braces: ${closeBraces}`);
if (openBraces === closeBraces) {
  console.log('CSS braces are perfectly balanced!');
} else {
  console.error(`ERROR: Mismatch of ${Math.abs(openBraces - closeBraces)} braces`);
}

