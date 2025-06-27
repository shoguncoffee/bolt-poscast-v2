import { Router } from 'express';
import { google } from 'googleapis';
import { Credentials } from '../../types.js';
import Supabase from '../../supabase/server.js';
import secret from '../../../secret/oath2/google.json' with { type: 'json' };
import { session } from '../middleware/session.js';

interface CallbackQuery {
  state: string;
  code: string;
  scope: string;
}

export default Router()
  .get('/oauth2/callback/google', async (req, res) => {
    // @ts-ignore
    const query_string = req.query as CallbackQuery;
    const supabase = Supabase();

    // @ts-ignore
    const { data: state } = await supabase
      .from('google_state')
      .select('id, user_id')
      .eq('id', query_string.state)
      // @ts-ignore
      // .eq('user_id', req.user.id)
      .single();

    if (state === null) {
      res.status(400).end();
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      secret.web.client_id,
      secret.web.client_secret,
      secret.web.redirect_uris[0],
    );

    console.log(secret.web.redirect_uris[0], req.url);

    const result = await oauth2Client.getToken(query_string.code);
    const credentials = result.tokens as Credentials;

    // @ts-ignore
    const { data: provider } = await supabase
      .from('provider')
      .select('*')
      .eq('name', 'youtube')
      // .eq('scope', tokens.scope!)
      .single();

      // @ts-ignore
    await supabase
      .from('oauth2')
      .upsert({
        provider_id: provider!.id,
        // @ts-ignore
        user_id: state.user_id,
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        at_expiry_time: Math.floor(credentials.expiry_date / 1000), // unix time in seconds
        rt_expiry_time: Math.floor(Date.now() / 1000) + credentials.refresh_token_expires_in, // unix time in seconds
      });

    res.set({
      'Content-Type': 'text/html'
    });
    res.send(`
      <script>
        window.opener.postMessage('${provider!.name}', '*');
        window.close();
      </script>
    `);
  });