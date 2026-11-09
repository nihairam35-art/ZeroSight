const http = require('http');

http.get('http://localhost:3000', (res) => {
  console.log(`Server HTTP Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log(`Server delivered ${data.length} bytes of index.html`);
    console.log(`Contains #app-stationary-header: ${data.includes('app-stationary-header')}`);
    console.log(`Contains #content-dashboard: ${data.includes('content-dashboard')}`);
  });
}).on('error', (err) => {
  console.log('Server not currently running or listening on port 3000:', err.message);
});

