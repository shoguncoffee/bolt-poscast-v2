import { Request, Response, NextFunction } from 'express';
import Supabase from '../../supabase/server.js';

export async function session(req: Request, res: Response, next: NextFunction) {
    const supabase = Supabase();

    const bearer = req.headers['authorization'] as string;
    const access_token = bearer.replace('Bearer ', '');

    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    console.log('current user:', user);

    if (user === null) {
      res.status(401).end();
      return;
    }

    // @ts-ignore
    req.supabase = supabase;
    // @ts-ignore
    req.user = user;

    next();
}