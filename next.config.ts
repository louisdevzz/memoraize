import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: '**',
        }
    ],
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
