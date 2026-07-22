import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  transpilePackages: ['three'],
  // GitHub Pages base path — remove trailing slash
  basePath: isStaticExport ? '/omniproxy-00ai-smart-router' : undefined,
  // Enable static image export for GitHub Pages
  images: {
    unoptimized: true,
  },
};

export default nextConfig;