import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["duckdb"],
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import these packages on the client side
      config.resolve.alias = {
        ...config.resolve.alias,
        'duckdb': false,
        '@mapbox/node-pre-gyp': false,
      };
    }

    // Ignore specific problematic files
    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader',
    });

    return config;
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;