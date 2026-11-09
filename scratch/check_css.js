const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.match(/^\s*(\.app-shell|\.app-sidebar|\.app-workspace|\.app-stationary-header|\.app-main-content|\.content-view)\b/)) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

