import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuraciones para Next.js 15
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Transpile framer-motion para evitar problemas con export *
  transpilePackages: ["framer-motion"],

  // Experimental features válidas en Next.js 15
  experimental: {
    // ppr: true,  // Partial Prerendering (si lo necesitas)
    // typedRoutes: true,  // Para rutas tipadas
    // serverActions: {
    //   bodySizeLimit: '2mb',
    // },
  },

  // Para manejar videos estáticos
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(webm|mp4)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
    });
    return config;
  },
};

export default nextConfig;
