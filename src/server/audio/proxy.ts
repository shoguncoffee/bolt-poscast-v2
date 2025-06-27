import { Router } from 'express';

// Proxy any audio file from a remote URL (e.g. S3) to bypass CORS <- no, just change file name
export default Router()
  .get('/proxy-audio', async (req, res) => {
    const url = req.query.url;
    const filename = req.query.filename as string || 'audio.wav';

    if (!url) {
      res.status(400).send('Missing url').end();
      return;
    }

    const response = await fetch(url as string);

    if (!response.ok) {
      res.status(500).send('Failed to fetch audio').end();
      return;
    }

    res.set({
      'Content-Type': response.headers.get('content-type')!,
      'Content-Disposition': `attachment; filename="${encodeURI(filename)}"`,
    });
    res.send(response.body);
  });