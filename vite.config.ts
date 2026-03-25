import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        workbox: {
          // skipWaiting è OMESSO intenzionalmente: con registerType 'prompt' il nuovo SW
          // deve restare in "waiting" finché l'utente clicca "Aggiorna Ora".
          clientsClaim: true,
          // NetworkFirst per i documenti HTML: fondamentale su iOS Safari dove la cache
          // può essere troppo aggressiva e ignorare gli aggiornamenti del SW.
          runtimeCaching: [
            {
              urlPattern: ({ request }: { request: Request }) => request.destination === 'document',
              handler: 'NetworkFirst' as const,
              options: {
                cacheName: 'html-cache',
                networkTimeoutSeconds: 5,
              },
            },
          ],
        },
        manifest: {
          short_name: 'Klass',
          name: 'Klass',

          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          start_url: '/',
          background_color: '#F5F5F5',
          display: 'standalone',
          scope: '/',
          theme_color: '#2563EB',
          description: 'Visualizza i tuoi voti e calcola la media con Klass'
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      hmr: process.env.DISABLE_HMR !== 'true',
      // Proxy API calls to the backend (Wrangler/Hono on port 8787)
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
  };
});
