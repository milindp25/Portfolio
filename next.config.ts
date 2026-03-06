import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev origins for local development
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3003",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
  ],

  // Generate unique build ID per deployment for cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Allow Giphy images for the 404 page
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media*.giphy.com",
      },
    ],
  },

  // Strict mode for catching common React issues
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Powered-by header removal (security best practice)
  poweredByHeader: false,

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Prevent browsers from caching HTML pages — always revalidate
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
