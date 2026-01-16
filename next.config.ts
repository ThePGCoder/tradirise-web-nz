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
  transpilePackages: [
    "@mui/material",
    "@mui/system",
    "@mui/x-data-grid",
    "@mui/x-date-pickers",
    "@mui/x-date-pickers-pro",
    "@mui/x-tree-view",
  ],
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
};

export default nextConfig;
