import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io", // 👈 allow Appwrite image/avatars
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB', // increase to 100 MB
    },
  },
};

export default nextConfig;
