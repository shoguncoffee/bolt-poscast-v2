import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types.js'

export default () => {
  return createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
}