import { Router } from 'express';
import { pipeline } from 'stream/promises';

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

    console.log(filename, encodeURI(filename), encodeURIComponent(filename));

    res.set({
      'Content-Type': response.headers.get('content-type')!,
      'Content-Disposition': `attachment; filename="${encodeURI(filename)}"`,
    });

    // @ts-ignore
    await pipeline(response.body!, res)
  });