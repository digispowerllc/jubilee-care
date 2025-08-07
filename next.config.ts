import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          }
        ],
      },
    ];
  },

  // Development settings
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,

  // CORS handling for development
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "(?<host>.*)",
            },
          ],
          destination: "/:path*",
        },
      ],
    };
  },

  // Allowed development origins (fixed formatting)
  allowedDevOrigins: process.env.NODE_ENV === "development"
    ? [
      "http://localhost:3000",
      "http://192.168.0.159:3000",
      // Add any other development URLs here
    ]
    : [],

  // Image optimization
  images: {
    domains: [], // Add your image domains here
    disableStaticImages: false,
    minimumCacheTTL: 60,
  },

  // Webpack optimizations
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },

  // Enable standalone output for Docker
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
};

export default nextConfig;