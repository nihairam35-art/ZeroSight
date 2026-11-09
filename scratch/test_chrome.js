const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

console.log('Testing Chrome launch...');
const proc = spawn(CHROME_PATH, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--remote-allow-origins=*',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--no-first-run',
  '--version'
]);

proc.stdout.on('data', d => console.log('STDOUT:', d.toString()));
proc.stderr.on('data', d => console.log('STDERR:', d.toString()));
proc.on('close', code => console.log('Exited with code:', code));

