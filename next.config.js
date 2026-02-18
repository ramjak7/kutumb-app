const withPWAInit = require('@ducanh2912/next-pwa');
const withPWA = (withPWAInit.default || withPWAInit)({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  reactCompiler: true,
  turbopack: {},
  transpilePackages: ['@pdf-lib/fontkit'],
});

module.exports = nextConfig;