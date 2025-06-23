// src/api/voiceProxy.ts
// Proxy function for Botnoi Voice API (for use in Vite/React projects)
// This file is for use in a Node.js/Express backend, not Next.js

import * as express from 'express';

const router = express.Router();

router.post('/voice', async (req: any, res: any) => {
  const { text, speaker } = req.body;
  try {
    const botnoiToken = process.env.BOTNOI_API_KEY ?? '';
    if (!botnoiToken) {
      res.status(500).json({ message: 'Missing BOTNOI_API_KEY in server environment' });
      return;
    }
    if (!text) {
      res.status(400).json({ message: 'Missing text in request body' });
      return;
    }
    const botnoiRes = await fetch('https://api-voice.botnoi.ai/openapi/v1/generate_audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Botnoi-Token': botnoiToken,
      },
      body: JSON.stringify({
        text,
        speaker: speaker || '1',
        volume: '1',
        speed: 1,
        type_media: 'mp3',
        save_file: 'true',
        language: 'th',
      }),
    });
    let responseText = await botnoiRes.text();
    let data: any = {};
    try { data = JSON.parse(responseText); } catch {}
    if (!botnoiRes.ok) {
      console.error('Botnoi API error:', botnoiRes.status, data);
      res.status(botnoiRes.status).json({ message: data.message || 'Failed to generate audio from Botnoi API', details: data });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error in /api/voice:', error && (error as any).stack ? (error as any).stack : error);
    res.status(500).json({ message: 'Internal Server Error', details: (error as any)?.message });
  }
});

export default router;
