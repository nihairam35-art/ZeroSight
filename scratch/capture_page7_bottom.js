const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const indexPath = path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');

const outFile = path.join(artifactDir, 'page7_reports_bottom.png');

// Use a runner HTML that scrolls the content down before screenshot
const runnerHtml = path.resolve(__dirname, 'scroll_reports.html');
fs.writeFileSync(runnerHtml, `
<!DOCTYPE html>
<html>
<head>
<style>
  body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
  iframe { width: 100%; height: 100%; border: none; }
</style>
</head>
<body>
<iframe id="frame" src="../index.html#reports"></iframe>
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      const doc = document.getElementById('frame').contentDocument;
      const scrollEl = doc.getElementById('app-main-content');
      if (scrollEl) {
        scrollEl.scrollTop = 9999;
      }
    }, 1500);
  });
</script>
</body>
</html>
`);

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=1440,900',
  `--screenshot=${outFile}`,
  '--virtual-time-budget=3500',
  `file:///${runnerHtml.replace(/\\/g, '/')}`
];

try {
  execFileSync(chromeExe, args, { stdio: 'ignore', timeout: 20000 });
  const stat = fs.statSync(outFile);
  console.log(`[CAPTURED] page7_reports_bottom.png - ${Math.round(stat.size / 1024)} KB`);
} catch (err) {
  console.error('[ERROR]:', err.message);
}

