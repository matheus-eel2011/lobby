import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora erros TypeScript durante o build
    ignoreBuildErrors: true,
  },
  // eslint não faz parte do tipo NextConfig, então tipamos como any
  // para conseguir passar a opção sem reclamar.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

export default nextConfig;
