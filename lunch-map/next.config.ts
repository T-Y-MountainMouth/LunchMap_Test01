import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // 環境変数がビルド時に利用可能であることを確認
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },
};

export default nextConfig;
