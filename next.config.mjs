// next.config.mjs - REMOVER PWA
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ❌ REMOVER: Todas as configurações PWA
  // ❌ REMOVER: withPWA()
  // ❌ REMOVER: dest, disable, register, etc.
};

export default nextConfig;