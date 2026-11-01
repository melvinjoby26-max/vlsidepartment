// Local static HTTP server & Admin API for EE - VLSI Website
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
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
  // API Endpoint: Save Updated Events & Config to js/events-data.js on Disk
  // -------------------------------------------------------------------------
  if (req.method === 'POST' && reqPath === '/api/save-data') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { departmentConfig, eventsData, tickerItems } = payload;

        // Generate JavaScript source code for js/events-data.js
        const jsContent = `/**
 * EE - VLSI DESIGN AND TECHNOLOGY
 * Sri Shakthi Institute of Engineering & Technology
 * Department Events Configuration & Data File
 * 
 * Automatically updated via Admin Portal on ${new Date().toLocaleString()}
 */

// Base Defaults
const DEFAULT_DEPARTMENT_CONFIG = ${JSON.stringify(departmentConfig, null, 2)};

const DEFAULT_EVENTS_DATA = ${JSON.stringify(eventsData, null, 2)};

const DEFAULT_TICKER_ITEMS = ${JSON.stringify(tickerItems, null, 2)};

// Load from LocalStorage if user has client-side overrides, else use defaults
function loadDepartmentState() {
  let cfg = null;
  let evs = null;
  let tck = null;

  try {
    if (typeof localStorage !== 'undefined') {
      const storedCfg = localStorage.getItem('vlsi_dept_config');
      if (storedCfg) {
        try { cfg = JSON.parse(storedCfg); } catch(e) {}
      }

      const storedEvs = localStorage.getItem('vlsi_events_data');
      if (storedEvs) {
        try {
          const parsed = JSON.parse(storedEvs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            evs = parsed;
          }
        } catch(e) {}
      }

      const storedTck = localStorage.getItem('vlsi_ticker_items');
      if (storedTck) {
        try {
          const parsedTck = JSON.parse(storedTck);
          if (Array.isArray(parsedTck) && parsedTck.length > 0) {
            tck = parsedTck;
          }
        } catch(e) {}
      }
    }
  } catch (err) {
    console.warn('LocalStorage unavailable, using defaults');
  }

  let activeEvents = (Array.isArray(evs) && evs.length > 0) ? evs : [...DEFAULT_EVENTS_DATA];

  activeEvents = activeEvents.map(ev => {
    if (!ev || typeof ev !== 'object') return null;
    if (!ev.theme) {
      ev.theme = {
        primaryColor: '#1d4ed8',
        accentGradient: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
        patternType: 'wafer-grid',
        iconName: 'chip'
      };
    }
    if (!ev.status) {
      ev.status = (ev.id === 'veltraxx-2') ? 'Coming Soon' : 'Completed';
    }
    if (!ev.statusLabel) {
      if (ev.status === 'Completed') {
        ev.statusLabel = 'Event Completed';
      } else if (ev.status === 'Coming Soon') {
        ev.statusLabel = 'Opens Soon';
      } else if (ev.registrationClosed || ev.status === 'Closed') {
        ev.statusLabel = 'Registration Closed';
      } else {
        ev.statusLabel = 'Registration Open';
      }
    }
    if (!ev.regControl) {
      ev.regControl = (ev.status === 'Coming Soon') ? 'opens_soon' : (ev.status === 'Open' ? 'open' : 'closed');
    }
    if (!ev.category) {
      ev.category = 'Competitions';
    }
    return ev;
  }).filter(Boolean);

  if (activeEvents.length === 0) {
    activeEvents = [...DEFAULT_EVENTS_DATA];
  }

  const activeConfig = cfg ? Object.assign({}, DEFAULT_DEPARTMENT_CONFIG, cfg) : DEFAULT_DEPARTMENT_CONFIG;
  const activeTicker = (Array.isArray(tck) && tck.length > 0) ? tck : [...DEFAULT_TICKER_ITEMS];

  return {
    departmentConfig: activeConfig,
    eventsData: activeEvents,
    tickerItems: activeTicker
  };
}

var _state = loadDepartmentState();
var DEPARTMENT_CONFIG = _state.departmentConfig;
var EVENTS_DATA = _state.eventsData;
var TICKER_ITEMS = _state.tickerItems;

function getEventById(id) {
  return EVENTS_DATA.find(event => event.id === id) || null;
}

if (typeof window !== 'undefined') {
  window.DEFAULT_DEPARTMENT_CONFIG = DEFAULT_DEPARTMENT_CONFIG;
  window.DEFAULT_EVENTS_DATA = DEFAULT_EVENTS_DATA;
  window.DEFAULT_TICKER_ITEMS = DEFAULT_TICKER_ITEMS;
  window.DEPARTMENT_CONFIG = DEPARTMENT_CONFIG;
  window.EVENTS_DATA = EVENTS_DATA;
  window.TICKER_ITEMS = TICKER_ITEMS;
  window.getEventById = getEventById;
}
`;

        const targetFile = path.join(ROOT, 'js', 'events-data.js');
        fs.writeFile(targetFile, jsContent, 'utf8', (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Updated js/events-data.js successfully!' }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

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
