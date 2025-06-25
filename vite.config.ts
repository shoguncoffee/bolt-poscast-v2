import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/voice': 'http://localhost:3001',
      '/api/voice-list': 'http://localhost:3001',
      '/api/export-mp4': 'http://localhost:3001',
      '/api/proxy-audio': 'http://localhost:3001',
    },
  },
});
