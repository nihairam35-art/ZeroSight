const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, 'in_browser_audit.html').replace(/\\/g, '/');
const targetUrl = `file:///${htmlPath}`;

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--allow-file-access-from-files',
  '--disable-web-security',
  '--dump-dom',
  '--virtual-time-budget=25000',
  targetUrl
];

try {
  const output = execFileSync(chromeExe, args, { encoding: 'utf-8', timeout: 35000 });
  const match = output.match(/<div id="audit-json-output">([\s\S]*?)<\/div>/);
  if (match) {
    const data = JSON.parse(match[1]);
    console.log(`\n=== AUDIT RESULTS SUMMARY ===`);
    console.log(`Passed: ${data.passed}`);
    console.log(`Failed: ${data.failed}`);
    console.log(`Total: ${data.results.length}`);
    if (data.failed > 0) {
      console.log('\nFailed Checks:');
      data.results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`- [${r.category}] ${r.name}: ${r.detail}`);
      });
    } else {
      console.log('\nALL IN-BROWSER CHECKS PASSED WITH 100% SUCCESS!');
    }
  } else {
    console.log('Could not find audit-json-output in DOM');
  }
} catch (err) {
  console.error('Error running check:', err.message);
}

