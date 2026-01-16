import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["zseydqapumxnbnpopurq.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-90fa8c55f2d44583b044a17ca76fa4d1.r2.dev",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Increase to handle multiple large images
    },
  },
};

export default nextConfig;
