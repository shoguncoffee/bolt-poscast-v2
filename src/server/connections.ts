import { Router } from 'express';
import { OAuth2ProvidersResponse } from '../types.js';
import { session } from './middleware/session.js';

export default Router()
  .get('/oauth2/connections', session, async (req, res) => {
    // @ts-ignore
    const { data: oauth2_data } = await req.supabase
      .from('oauth2')
      .select('*, provider(name, scope)')
      // @ts-ignore
      .eq('user_id', req.user.id);

    if (oauth2_data === null) {
      res.status(404).end();
      return;
    }

    console.log('oauth2_data:', oauth2_data);

    const now_time = Date.now() / 1000;
    const dtos: OAuth2ProvidersResponse = oauth2_data
      .filter(item => (item.rt_expiry_time || Infinity) > now_time)
      .map(item => item.provider);

    res.json(dtos);
  });