import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    hmr: false,
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ["src/server/**", "dist/**"],
    },
    allowedHosts: [
      'icarus24.tailc3d0f.ts.net',
    ],
  },
});