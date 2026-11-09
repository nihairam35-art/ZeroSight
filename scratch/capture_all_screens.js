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
  console.error('Google Chrome executable not found in standard paths');
  process.exit(1);
}

console.log('Using Chrome:', chromeExe);

const artifactDir = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const indexPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');

const pages = [
  { name: 'page1_welcome.png', hash: '#welcome', width: 1440, height: 900 },
  { name: 'page2_login.png', hash: '#login', width: 1440, height: 900 },
  { name: 'page3_dashboard.png', hash: '#dashboard', width: 1440, height: 900 },
  { name: 'page4_alerts.png', hash: '#alerts', width: 1440, height: 900 },
  { name: 'page5_alert_details.png', hash: '#alert-details', width: 1440, height: 900 },
  { name: 'page6_simulator.png', hash: '#simulator', width: 1440, height: 900 },
  { name: 'page7_reports.png', hash: '#reports', width: 1440, height: 900 },
  { name: 'page8_settings.png', hash: '#settings', width: 1440, height: 900 },
  { name: 'page9_support.png', hash: '#support', width: 1440, height: 900 },
  // Responsive tests
  { name: 'responsive_desktop_1920.png', hash: '#dashboard', width: 1920, height: 1080 },
  { name: 'responsive_laptop_1440.png', hash: '#dashboard', width: 1440, height: 900 },
  { name: 'responsive_laptop_1366.png', hash: '#alerts', width: 1366, height: 768 },
  { name: 'responsive_tablet_1024.png', hash: '#alert-details', width: 1024, height: 768 },
  { name: 'responsive_tablet_768.png', hash: '#simulator', width: 768, height: 1024 },
  { name: 'responsive_mobile_375.png', hash: '#dashboard', width: 375, height: 812 }
];

pages.forEach(p => {
  const outFile = path.join(artifactDir, p.name);
  const targetUrl = `file:///${indexPath}${p.hash}`;
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=${p.width},${p.height}`,
    `--screenshot=${outFile}`,
    '--virtual-time-budget=2000',
    targetUrl
  ];

  try {
    execFileSync(chromeExe, args, { stdio: 'pipe', timeout: 15000 });
    const stat = fs.statSync(outFile);
    console.log(`[CAPTURED] ${p.name} (${p.width}x${p.height}) -> ${Math.round(stat.size / 1024)} KB`);
  } catch (err) {
    console.error(`[ERROR] Failed to capture ${p.name}:`, err.message);
  }
});

console.log('All screenshots completed successfully!');
