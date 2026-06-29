import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.watchOptions = {
      ignored: ["**/backend/**"],
    };
    return config;
  },
};

export default nextConfig;