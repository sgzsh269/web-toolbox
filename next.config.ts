import type { NextConfig } from "next";

// Use NEXT_PUBLIC_BASE_PATH for local testing vs GitHub Pages deployment
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  // Use environment variable to control base path
  basePath: basePath,
  // Disable image optimization since it's not compatible with static export
  images: {
    unoptimized: true,
  },
  // Disable TypeScript checking during build for deployment
  typescript: {
    // !! WARN !!
    // This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable ESLint checking during build for deployment
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
