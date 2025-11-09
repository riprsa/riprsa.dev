import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    // tsconfigPath: "./tsconfig.json",
  },
  // transpilePackages: ["@riprsa.dev/backend"],
};

export default nextConfig;
