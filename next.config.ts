import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors: true
},
eslint:{
    ignoreDuringBuilds: true
},
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,}
};

export default nextConfig;
