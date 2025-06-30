import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import connections from './connections.js';
import script from './audio/script.js';
import proxy from './audio/proxy.js';
import botnoi from './audio/botnoi.js';
import callback from './oauth2/callback.js';
import youtube from './oauth2/youtube.js';
import generate from './video/generate.js';
import upload from './video/upload.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());

app.use('/api', botnoi);
app.use('/api', proxy);
app.use('/api', script);
app.use('/api', generate);
app.use('/api', upload);
app.use('/api', connections);
app.use('/api', callback);
app.use('/api', youtube);
app.get('/ping', (req, res) => { res.send('pong') });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
