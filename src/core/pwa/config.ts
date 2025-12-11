import { pwaManifest } from '../../config/pwa';

export const pwaOptions = {
  registerType: 'autoUpdate',
  manifest: pwaManifest,
  workbox: {
    // Include all generated assets (including the dev SW helpers) so dev builds
    // have at least one match and Workbox doesn't warn about empty globs.
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
    globIgnores: ['**/node_modules/**/*'],
    navigateFallback: 'index.html', // Offline UI handled in React (AppShell + OfflineScreen)
  },
  devOptions: {
    enabled: true
  }
} as const;
