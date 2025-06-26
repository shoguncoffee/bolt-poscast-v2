import { Router } from 'express';

export default Router()
  .post('/voice', async (req, res) => {
    const {
      text,
      speaker = '1',
      volume = 1,
      speed = 1,
      language = 'th'
    } = req.body;

    const botnoiResponse = await fetch(
      'https://api-voice.botnoi.ai/openapi/v1/generate_audio',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Botnoi-Token': process.env.BOTNOI_API_KEY!
        },
        body: JSON.stringify({
          text,
          speaker: speaker,
          volume: volume,
          speed: speed,
          type_media: 'wav',
          save_file: 'true',
          language: language,
        })
      }
    );

    if (!botnoiResponse.ok) {
      const errorText = await botnoiResponse.text();
      console.error('Botnoi API error:', botnoiResponse.status, errorText);

      res.status(botnoiResponse.status).json({
        error: 'Botnoi API error',
        details: errorText
      });
      return;
    }

    const botnoiData = await botnoiResponse.json();

    res.json(botnoiData);
  });