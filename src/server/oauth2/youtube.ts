import { Router } from 'express';
import { google } from 'googleapis';
import Supabase from '../../supabase/server.js';
import secret from '../../../secret/oath2/google.json' with { type: 'json' };
import { ConnectResponse } from '../../types.js';
import { session } from '../middleware/session.js';

export default Router()
  .get('/oauth2/connections/youtube', session, async (req, res) => {
    // @ts-ignore
    const { data: state , error } = await req.supabase
      .from('google_state')
      .insert({
        // @ts-ignore
        user_id: req.user.id,
      })
      .select('id')
      .single();

    const oauth2Client = new google.auth.OAuth2();
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'online' (default), 'offline' (gets refresh_token)
      client_id: secret.web.client_id,
      redirect_uri: secret.web.redirect_uris[0],
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
      ],
      state: state!.id,
      prompt: 'consent', // force re-consent
    });

    res.json({ url });
  });