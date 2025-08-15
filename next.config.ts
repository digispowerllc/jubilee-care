// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  turbopack: isDev
    ? {
      resolveAlias: {
        underscore: "lodash",
      },
      resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
    }
    : undefined,

  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "(?<host>.*)" }],
          destination: "/:path*",
        },
      ],
    };
  },

  images: {
    remotePatterns: [
      new URL('https://res.cloudinary.com/**'),
      new URL('https://ui-avatars.com/**'),
    ],
    disableStaticImages: false,
    minimumCacheTTL: 60,
  },

  webpack: (config) => {
    if (!isDev) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },

  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
};

export default nextConfig;
