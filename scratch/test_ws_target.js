const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    'about:blank'
  ]);

  let wsUrl = null;
  proc.stderr.on('data', d => {
    const str = d.toString();
    const match = str.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:9222\/[^\s]+)/);
    if (match) {
      wsUrl = match[1];
      console.log('Intercepted WS URL:', wsUrl);
    }
  });

  // Wait for WS URL
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    if (wsUrl) break;
  }

  if (wsUrl) {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log('Connected to browser WS!');
      ws.send(JSON.stringify({ id: 1, method: 'Target.getTargets' }));
    };
    ws.onmessage = e => {
      console.log('Received response:', e.data.substring(0, 200));
      ws.close();
      proc.kill();
      process.exit(0);
    };
  } else {
    console.error('Failed to get WS URL');
    proc.kill();
    process.exit(1);
  }
}

test();

