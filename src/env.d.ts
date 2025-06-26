declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASE_URL: string;
            SUPABASE_ANON_KEY: string;
            BOTNOI_API_KEY: string;
            GEMINI_API_KEY: string;
        }
    }
}

export {}