// Local static HTTP server & Admin API for EE - VLSI Website
const http = require('http');
const fs = require('fs');
const path = require('path');

 const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Handle CORS for convenience
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlParts = req.url.split('?');
  const reqPath = decodeURI(urlParts[0]);

 

  // -------------------------------------------------------------------------
  // API Endpoint: Save Student Registration
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/register') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newReg = JSON.parse(body);
        newReg.timestamp = new Date().toISOString();

        const dataDir = path.join(ROOT, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const regFile = path.join(dataDir, 'registrations.json');
        let allRegs = [];
        if (fs.existsSync(regFile)) {
          try {
            allRegs = JSON.parse(fs.readFileSync(regFile, 'utf8'));
          } catch(e) {
            allRegs = [];
          }
        }
        allRegs.unshift(newReg);
        fs.writeFileSync(regFile, JSON.stringify(allRegs, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Registration recorded' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid data' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------------------
  // Static File Serving
  // -------------------------------------------------------------------------
 // Prevent public access to registration records
if (
  reqPath === '/data' ||
  reqPath.startsWith('/data/') ||
  reqPath === '/registrations.json'
) {
  res.writeHead(404);
  res.end('Not Found');
  return;
}
  let filePathRel = reqPath;
  if (filePathRel === '/' || filePathRel === '') {
    filePathRel = '/index.html';
  }

  const filePath = path.join(ROOT, filePathRel);

  // Prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

const os = require('os');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '192.168.1.5';
}

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`🚀 EE - VLSI SERVER ACTIVE ON YOUR NETWORK`);
  console.log(`💻 On your computer:`);
  console.log(`   Website:      http://localhost:${PORT}/`);
  console.log(`   Admin Portal: http://localhost:${PORT}/admin.html`);
  console.log(`\n📱 On your mobile phone (connect to same Wi-Fi):`);
  console.log(`   Website:      http://${localIp}:${PORT}/`);
  console.log(`   Admin Portal: http://${localIp}:${PORT}/admin.html`);
  console.log(`======================================================\n`);
});
