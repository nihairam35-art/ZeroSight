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
  console.error('Google Chrome executable not found');
  process.exit(1);
}

const artifactDir = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const indexPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');

const viewports = [
  { name: 'page4_alerts.png', width: 1440, height: 900 },
  { name: 'page4_desktop_1920.png', width: 1920, height: 1080 },
  { name: 'page4_laptop_1440.png', width: 1440, height: 900 },
  { name: 'page4_laptop_1366.png', width: 1366, height: 768 },
  { name: 'page4_tablet_1024.png', width: 1024, height: 768 },
  { name: 'page4_tablet_768.png', width: 768, height: 1024 },
  { name: 'page4_mobile_375.png', width: 375, height: 812 }
];

console.log('Capturing Dark SOC Command Center screenshots with Chrome...');

viewports.forEach(vp => {
  const outFile = path.join(artifactDir, vp.name);
  const targetUrl = `file:///${indexPath}#alerts`;
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=${vp.width},${vp.height}`,
    `--screenshot=${outFile}`,
    '--virtual-time-budget=3000',
    targetUrl
  ];

  try {
    execFileSync(chromeExe, args, { stdio: 'ignore', timeout: 20000 });
    const stat = fs.statSync(outFile);
    console.log(`[SAVED] ${vp.name} (${vp.width}x${vp.height}) - ${Math.round(stat.size / 1024)} KB`);
  } catch (err) {
    console.error(`[ERROR] Failed capturing ${vp.name}:`, err.message);
  }
});

console.log('All Dark SOC Command Center screenshots captured successfully.');

