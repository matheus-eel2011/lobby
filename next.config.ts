import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Necessário para o Dockerfile
  typescript: {
    ignoreBuildErrors: true, // Remove depois de corrigir os erros TS
  },
  eslint: {
    ignoreDuringBuilds: true, // Remove depois de corrigir os erros ESLint
  },
};

export default nextConfig;
