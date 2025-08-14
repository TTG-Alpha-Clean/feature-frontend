import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  workboxOptions: {
    navigationPreload: true,
    // ❌ REMOVER estas linhas se existirem:
    // navigateFallback: '/offline.html',
    // navigateFallbackAllowlist: [ ... ],
    // (opcional) zere o cache de API se quiser:
    // runtimeCaching: [],
  },
})({
  reactStrictMode: true,
});
