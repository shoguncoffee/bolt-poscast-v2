// import 'dotenv/config';
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types.js'

export default () => {
  return createClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );
}