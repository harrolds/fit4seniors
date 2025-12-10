import {
  APP_BRAND,
  THEME_COLOR,
  BACKGROUND_COLOR
} from './appConfig';

export const pwaManifest = {
  name: APP_BRAND.appName,
  short_name: APP_BRAND.shortName,
  description: APP_BRAND.description,
  theme_color: APP_BRAND.primaryColor || THEME_COLOR,
  background_color: BACKGROUND_COLOR,
  display: 'standalone',
  start_url: '/',
  orientation: 'portrait',
  icons: [
    {
      src: APP_BRAND.logoPath,
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
} as const;
