import express from 'express';
// @ts-ignore
import fetch from 'node-fetch';

const router = express.Router();

// Proxy any audio file (mp3/mp4) from a remote URL (e.g. S3) to bypass CORS
router.get('/proxy-audio', (req: any, res: any) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url');
  fetch(url as string)
    .then((response: any) => {
      if (!response.ok) return res.status(500).send('Failed to fetch audio');
      res.set('Content-Type', response.headers.get('content-type') || 'video/mp4');
      const filename = req.query.filename || 'audio.mp4';
      res.set('Content-Disposition', `attachment; filename="${filename}"`);
      if (response.body && typeof response.body.pipe === 'function') {
        response.body.pipe(res);
      } else {
        response.arrayBuffer().then((buffer: any) => res.send(Buffer.from(buffer)));
      }
    })
    .catch((err: any) => {
      res.status(500).send('Proxy error: ' + (err instanceof Error ? err.message : String(err)));
    });
});

export default router;
