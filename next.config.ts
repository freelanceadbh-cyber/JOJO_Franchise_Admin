import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@prisma/client': '@prisma/client'
    }
  }
};

export default nextConfig;
