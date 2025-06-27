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

    const botnoi_res = await fetch(
      'https://api-voice.botnoi.ai/openapi/v1/generate_audio',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Botnoi-Token': process.env.BOTNOI_API_KEY,
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

    if (!botnoi_res.ok) {
      const msg = await botnoi_res.text();
      console.error('Botnoi API error:', botnoi_res.status, msg);

      res.status(botnoi_res.status).end();
      return;
    }

    const botnoiData = await botnoi_res.json();

    res.send(botnoiData.audio_url);
  });