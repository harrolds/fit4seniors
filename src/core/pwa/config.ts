import { pwaManifest } from '../../config/pwa';

const isDevEnv = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ?? process.env.NODE_ENV !== 'production';

export const pwaOptions = {
  registerType: 'autoUpdate',
  manifest: pwaManifest,
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
    navigateFallback: 'index.html', // Offline UI handled in React (AppShell + OfflineScreen)
  },
  devOptions: {
    enabled: isDevEnv
  }
} as const;
