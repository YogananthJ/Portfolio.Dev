import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'visitors.json');

// Helper to safely read visitor database
function readVisitorsData(): { totalVisitors: number; visitors: string[]; lastUpdated: string } {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading visitors.json:', err);
  }
  return {
    totalVisitors: 1428,
    visitors: [],
    lastUpdated: new Date().toISOString(),
  };
}

// Helper to safely write visitor database
function writeVisitorsData(data: { totalVisitors: number; visitors: string[]; lastUpdated: string }) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing visitors.json:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Endpoints ---
  // GET /api/visitors - Retrieve current total visitors
  app.get('/api/visitors', (_req, res) => {
    const data = readVisitorsData();
    res.json({
      success: true,
      totalVisitors: data.totalVisitors,
      lastUpdated: data.lastUpdated,
    });
  });

  // POST /api/visitors - Record visit if unique visitor
  app.post('/api/visitors', (req, res) => {
    const { visitorId } = req.body;
    const data = readVisitorsData();

    if (!visitorId || typeof visitorId !== 'string') {
      return res.json({
        success: true,
        totalVisitors: data.totalVisitors,
        isNewVisitor: false,
      });
    }

    const isAlreadyRecorded = data.visitors.includes(visitorId);

    if (!isAlreadyRecorded) {
      data.visitors.push(visitorId);
      // Keep only last 10,000 unique IDs to prevent unbounded file growth
      if (data.visitors.length > 10000) {
        data.visitors = data.visitors.slice(-10000);
      }
      data.totalVisitors += 1;
      data.lastUpdated = new Date().toISOString();
      writeVisitorsData(data);

      return res.json({
        success: true,
        totalVisitors: data.totalVisitors,
        isNewVisitor: true,
      });
    }

    return res.json({
      success: true,
      totalVisitors: data.totalVisitors,
      isNewVisitor: false,
    });
  });

  // --- Vite / Frontend Serving ---
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite Dev Server Middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
