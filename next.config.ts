import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Base path should match your GitHub repository name if not publishing to a custom domain
  // For example, if your repository is named 'web-toolbox', use basePath: '/web-toolbox'
  // Leave it blank if you're using a custom domain or if your repository name is username.github.io
  basePath: process.env.NODE_ENV === "production" ? "/proj-web-toolbox" : "",
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
