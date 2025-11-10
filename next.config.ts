import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler (Next.js 16+)
  reactCompiler: true,

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

  // Eliminar console.log en producción para reducir bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? {
          exclude: ["error", "warn"], // Mantener console.error y console.warn para debugging
        }
      : false, // NO eliminar console.log en desarrollo
  },

  // Rutas tipadas (movido de experimental en Next.js 15.5+)
  typedRoutes: true,

  // Experimental features
  experimental: {
    // ppr: true,  // Partial Prerendering (si lo necesitas)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Turbopack configuration (Next.js 16+)
  // Turbopack maneja archivos de medios automáticamente
  turbopack: {},

  // Para manejar videos estáticos (usado cuando se compila con webpack)
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
