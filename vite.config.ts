import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { pwaOptions } from './src/core/pwa/config';

// Skeleton v1 – Vite basisconfiguratie met PWA-ondersteuning
export default defineConfig({
  plugins: [
    react(),
    VitePWA(pwaOptions)
  ]
});
