import express from 'express';
// @ts-ignore
import fetch from 'node-fetch';

const router = express.Router();

// Voice generation endpoint that proxies to Botnoi API
router.post('/voice', async (req: any, res: any) => {
  try {
    const {
      text,
      speaker = '1',
      volume = 1,
      speed = 1,
      type_media = 'm4a',
      save_file = true,
      language = 'th'
    } = req.body;

    if (!text) {
      console.log('Missing text parameter');
      return res.status(400).json({ error: 'Missing text parameter' });
    }

    // Get Botnoi API key from environment
    const botnoiApiKey = process.env.BOTNOI_API_KEY;
    if (!botnoiApiKey) {
      console.log('Missing BOTNOI_API_KEY in environment');
      return res.status(500).json({ error: 'Missing BOTNOI_API_KEY in environment' });
    }

    // Prepare request to Botnoi API
    const botnoiPayload = {
      text,
      speaker: String(speaker),
      volume: String(volume),
      speed: String(speed),
      type_media: String(type_media),
      save_file: String(save_file),
      language: String(language)
    };

    // Make request to Botnoi API
    const botnoiResponse = await fetch("https://api-voice.botnoi.ai/openapi/v1/generate_audio", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Botnoi-Token': botnoiApiKey
      },
      body: JSON.stringify(botnoiPayload)
    });

    console.log('Botnoi API response status:', botnoiResponse.status);

    if (!botnoiResponse.ok) {
      const errorText = await botnoiResponse.text();
      console.error('Botnoi API error:', botnoiResponse.status, errorText);
      return res.status(botnoiResponse.status).json({ 
        error: 'Botnoi API error', 
        details: errorText 
      });
    }

    const botnoiData = await botnoiResponse.json();
    console.log('Botnoi API success response received');
    res.json(botnoiData);

  } catch (error) {
    console.error('Voice proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

export default router;
