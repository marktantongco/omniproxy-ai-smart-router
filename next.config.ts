import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ['three'],
  // GitHub Pages base path — remove trailing slash
  basePath: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? '/omniproxy-ai-smart-router' : undefined,
  // Enable static image export for GitHub Pages
  images: {
    unoptimized: true,
  },
};

export default nextConfig;