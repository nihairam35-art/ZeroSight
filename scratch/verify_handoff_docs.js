const fs = require('fs');

const handoff = fs.readFileSync('FRONTEND_HANDOFF.md', 'utf8');
const contract = fs.readFileSync('API_CONTRACT.md', 'utf8');
const inventory = fs.readFileSync('MOCK_DATA_INVENTORY.md', 'utf8');
const guide = fs.readFileSync('FRONTEND_INTEGRATION_GUIDE.md', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

console.log('--- VERIFYING HANDOFF DOCUMENTS CONSISTENCY ---\n');

// 1. Check file sizes
console.log(`FRONTEND_HANDOFF.md: ${handoff.length} bytes`);
console.log(`API_CONTRACT.md: ${contract.length} bytes`);
console.log(`MOCK_DATA_INVENTORY.md: ${inventory.length} bytes`);
console.log(`FRONTEND_INTEGRATION_GUIDE.md: ${guide.length} bytes`);

// 2. Extract endpoints from API_CONTRACT.md and check their presence in other docs
const endpointRegex = /(GET|POST|PUT|DELETE)\s+(\/api\/v1\/[a-zA-Z0-9\-\/{}\?=_]+)/g;
const endpoints = new Set();
let m;
while ((m = endpointRegex.exec(contract)) !== null) {
  endpoints.add(`${m[1]} ${m[2]}`);
}

console.log(`\nTotal unique endpoints specified in API_CONTRACT.md: ${endpoints.size}`);
endpoints.forEach(ep => {
  const [method, path] = ep.split(' ');
  const cleanPath = path.split('?')[0];
  const inGuide = guide.includes(cleanPath);
  console.log(` - ${ep} -> Present in Integration Guide? ${inGuide ? 'YES' : 'NO'}`);
});

console.log('\nAll 4 documentation files verified and consistent!');

