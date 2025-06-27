import { Router } from 'express';
import { google } from 'googleapis';
import { stat } from 'fs/promises';
import readline from 'readline';
import fs from 'fs';
import { YoutubeUploadRequest, YoutubeUploadResponse, Credentials } from '../../types.js';
import Supabase from '../../supabase/server.js';
import secret from '../../../secret/oath2/google.json' with { type: 'json' };
import { session } from '../middleware/session.js';

const youtube = google.youtube('v3');
const oauth2Client = new google.auth.OAuth2(
  secret.web.client_id,
  secret.web.client_secret,
);

export default Router()
  .post('/upload/youtube', session, async (req, res) => {
    const input: YoutubeUploadRequest = req.body;

    // @ts-ignore
    const { data: provider } = await req.supabase
      .from('provider')
      .select('*')
      .eq('name', 'youtube')
      // .eq('scope', tokens.scope!)
      .single();

    // @ts-ignore
    const { data: credentials } = await req.supabase
      .from('oauth2')
      .select('*')
      // @ts-ignore
      .eq('user_id', req.user.id)
      .eq('provider_id', provider!.id)
      .single();

    const now_time = Date.now() / 1000;
    const expiry_time = credentials?.rt_expiry_time || Infinity;

    if (credentials === null || now_time > expiry_time) {
      res.status(400).end();
      return;
    }

    oauth2Client.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
    });

    if (now_time > credentials.at_expiry_time) {
      const result = await oauth2Client.refreshAccessToken();
      const new_credentials = result.credentials as Credentials;

      // @ts-ignore
      await req.supabase
        .from('oauth2')
        .update({
          access_token: new_credentials.access_token,
          at_expiry_time: Math.floor(new_credentials.expiry_date / 1000),
        })
        // @ts-ignore
        .eq('user_id', req.user.id)
        .eq('provider_id', provider!.id);

      console.log(`refresh token: ${credentials} => ${new_credentials}`);
    }

    const file_path = `tmp/${input.filename}`;
    const file_stat = await stat(file_path);
    const youtube_res = await youtube.videos.insert(
      {
        auth: oauth2Client,
        part: ['id', 'snippet', 'status'],
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: input.title,
            description: input.description,
          },
          status: {
            privacyStatus: input.privacy,
            madeForKids: false,
            selfDeclaredMadeForKids: false,
          },
        },
        media: {
          body: fs.createReadStream(file_path),
        },
      }, {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / file_stat.size) * 100;

          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);

          process.stdout.write(`upload ${input.filename}: ${Math.round(progress)}%`);
        },
      },
    );

    console.log();
    console.log(youtube_res.data);

    res.json(youtube_res.data as YoutubeUploadResponse);
  });