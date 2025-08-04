import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Other config options...
  allowedDevOrigins: ['http://192.168.0.159:3000, http://localhost:3000'], // Replace with your actual local IP and port
};

export default nextConfig;
