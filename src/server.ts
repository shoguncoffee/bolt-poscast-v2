import 'dotenv/config';
import express from 'express';
import proxyAudio from './api/audio/proxy';
import voiceProxy from './api/audio/botnoi';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

app.use('/api', voiceProxy);
app.use('/api', proxyAudio);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// Error handler for better debugging
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('API Proxy Error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal Server Error', details: err?.message, stack: err?.stack });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`API proxy running on http://localhost:${PORT}`);
});
