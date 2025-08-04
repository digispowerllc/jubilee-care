import type { NextConfig } from "next";
const crypto = 'crypto';

const nextConfig: NextConfig = {
  /* config options here */
 
    async headers() {
      return [
        {
          source: '/(.*)', // Apply to all routes
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `
              default-src 'self';
              script-src 'self' 'nonce-PLACEHOLDER';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' https:;
              connect-src 'self' https:;
              object-src 'none';
              base-uri 'self';
              frame-ancestors 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
            }
          ]
        }
      ];
    },

    // Optional: Add React strict mode, etc.
    reactStrictMode: true
  };

  export default nextConfig;
