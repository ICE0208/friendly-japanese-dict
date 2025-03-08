import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      cheerio: false,
      "node-fetch": false,
      "fetch-cookie": false,
      "tough-cookie": false,
    };
    return config;
  },
};

export default nextConfig;
