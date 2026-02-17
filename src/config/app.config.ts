// Centralized app configuration
export const APP_CONFIG = {
  appName: 'Kutumb Festival',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'hi'],
  dataRetentionYears: 2,
  pwa: {
    name: 'Kutumb Festival',
    short_name: 'Kutumb',
    theme_color: '#F59E42',
    background_color: '#FFFFFF',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};
