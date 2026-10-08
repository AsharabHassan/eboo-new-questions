import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow an isolated production check while the local preview uses .next.
  distDir: process.env.EBOO_BUILD_DIR || ".next",
};

export default nextConfig;
