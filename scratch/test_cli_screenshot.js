const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Ume Niha Iram\\.gemini\\antigravity\\brain\\33e4d023-6cb5-4deb-a65a-98af52cd5c9c';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const indexPath = path.resolve(__dirname, '..', 'index.html');
const testOut = path.join(ARTIFACT_DIR, 'test_dashboard.png');

console.log('Testing CLI screenshot on:', indexPath);
const cmd = `"${CHROME_PATH}" --headless=new --no-sandbox --disable-gpu --screenshot="${testOut}" --window-size=1920,1080 --virtual-time-budget=2000 "file:///${indexPath.replace(/\\/g, '/')}#dashboard"`;
console.log('Running cmd:', cmd);

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(testOut)) {
    console.log('SUCCESS! Screenshot generated:', fs.statSync(testOut).size, 'bytes');
  } else {
    console.error('File not created!');
  }
} catch (e) {
  console.error('Error:', e.message);
}
