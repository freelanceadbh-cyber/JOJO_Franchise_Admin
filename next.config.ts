import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    resolveAlias: {
      '@prisma/client': '@prisma/client'
    }
  }
};

export default nextConfig;
