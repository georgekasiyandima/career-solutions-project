/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Standalone output for Docker only (Vercel uses its own deployment)
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  // Transpile Material-UI packages
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  // Webpack configuration for better compatibility
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;

