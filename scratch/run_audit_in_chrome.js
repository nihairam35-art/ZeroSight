const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
];

let chromeExe = null;
for (const p of chromePaths) {
  if (p && fs.existsSync(p)) {
    chromeExe = p;
    break;
  }
}

if (!chromeExe) {
  console.error('Chrome executable not found');
  process.exit(1);
}

const auditHtmlPath = path.resolve(__dirname, 'in_browser_audit.html').replace(/\\/g, '/');
const targetUrl = `file:///${auditHtmlPath}`;
const artifactDir = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const screenshotPath = path.join(artifactDir, 'final_functionality_audit_report.png');

console.log('Running final Chrome in-browser functionality audit...');
console.log('Target URL:', targetUrl);

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--allow-file-access-from-files',
  '--disable-web-security',
  '--window-size=1440,2400',
  `--screenshot=${screenshotPath}`,
  '--virtual-time-budget=15000',
  targetUrl
];

try {
  execFileSync(chromeExe, args, { stdio: 'inherit', timeout: 30000 });
  const stat = fs.statSync(screenshotPath);
  console.log(`Successfully generated audit screenshot: ${screenshotPath} (${Math.round(stat.size / 1024)} KB)`);
} catch (err) {
  console.error('Failed to run Chrome audit:', err.message);
  process.exit(1);
}
