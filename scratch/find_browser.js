const fs = require('fs');
const { execSync } = require('child_process');

const candidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe'
];

for (const p of candidates) {
  if (p && fs.existsSync(p)) {
    console.log('BROWSER_FOUND:', p);
  }
}

try {
  const pup = require('puppeteer');
  console.log('PUPPETEER_AVAILABLE: true');
} catch (e) {
  console.log('PUPPETEER_AVAILABLE: false');
}

try {
  const pw = require('playwright');
  console.log('PLAYWRIGHT_AVAILABLE: true');
} catch (e) {
  console.log('PLAYWRIGHT_AVAILABLE: false');
}

