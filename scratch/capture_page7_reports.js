const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const indexPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');

const screens = [
  { name: 'page7_reports.png', width: 1440, height: 900 },
  { name: 'page7_desktop_1920.png', width: 1920, height: 1080 },
  { name: 'page7_laptop_1366.png', width: 1366, height: 768 },
  { name: 'page7_tablet_1024.png', width: 1024, height: 768 },
  { name: 'page7_tablet_768.png', width: 768, height: 1024 },
  { name: 'page7_mobile_375.png', width: 375, height: 812 }
];

console.log('Capturing Improved Visual-First Reports Page (Page 7) in Google Chrome...');

screens.forEach(s => {
  const outFile = path.join(artifactDir, s.name);
  const targetUrl = `file:///${indexPath}#reports`;
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=${s.width},${s.height}`,
    `--screenshot=${outFile}`,
    '--virtual-time-budget=3000',
    targetUrl
  ];

  try {
    execFileSync(chromeExe, args, { stdio: 'ignore', timeout: 20000 });
    const stat = fs.statSync(outFile);
    console.log(`[CAPTURED] ${s.name} (${s.width}x${s.height}) - ${Math.round(stat.size / 1024)} KB`);
  } catch (err) {
    console.error(`[ERROR] ${s.name}:`, err.message);
  }
});

console.log('All Page 7 screenshots captured successfully.');

