import { Router } from 'express';

// Proxy any audio file from a remote URL (e.g. S3) to bypass CORS
export default Router()
  .get('/proxy-audio', async (req, res) => {
    const url = req.query.url;

    if (!url) {
      res.status(400).send('Missing url');
      return;
    }

    const response = await fetch(url as string);

    if (!response.ok) {
      res.status(500).send('Failed to fetch audio');
      return;
    }

    const filename = req.query.filename || 'audio.mp4';

    res.set('Content-Type', response.headers.get('content-type')!);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(response.body);
  });