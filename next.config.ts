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
};

export default nextConfig;
