const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Simple tag stack checker for div, main, aside, section, header
const lines = html.split('\n');
const stack = [];

lines.forEach((line, lineNum) => {
  const regex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*?)?(\/?)>/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isSelfClosing = match[2] === '/' || ['img', 'input', 'br', 'hr', 'meta', 'link', 'line', 'polyline', 'rect', 'circle', 'path', 'polygon'].includes(tagName);
    const isClosing = fullTag.startsWith('</');

    if (['div', 'main', 'aside', 'section', 'header'].includes(tagName)) {
      if (isClosing) {
        if (stack.length === 0) {
          console.log(`Unmatched closing </${tagName}> at line ${lineNum + 1}`);
        } else {
          const top = stack.pop();
          if (top.tagName !== tagName) {
            console.log(`Mismatched </${tagName}> at line ${lineNum + 1}, expected </${top.tagName}> (opened at ${top.lineNum})`);
          }
        }
      } else if (!isSelfClosing) {
        stack.push({ tagName, lineNum: lineNum + 1, line: line.trim() });
      }
    }
  }
});

console.log('Remaining unclosed tags:', stack.length);
stack.forEach(s => console.log(`Unclosed <${s.tagName}> from line ${s.lineNum}: ${s.line}`));

