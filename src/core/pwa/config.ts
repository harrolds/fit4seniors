import { pwaManifest } from '../../config/pwa';

export const pwaOptions = {
  registerType: 'autoUpdate',
  manifest: pwaManifest,
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
    navigateFallback: 'index.html', // Offline UI handled in React (AppShell + OfflineScreen)
  },
  devOptions: {
    enabled: true
  }
} as const;
