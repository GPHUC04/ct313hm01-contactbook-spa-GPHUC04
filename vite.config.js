import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      process: 'process/browser',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ct313hm01-contactbook-api-gphuc04.onrender.com',
        changeOrigin: true,
      },
      '/public': {
        target: 'https://ct313hm01-contactbook-api-gphuc04.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
