// Update to next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizeCss: false, // Disable automatic CSS optimization (since Tailwind is used)
    // Add memory and timeout improvements
    largePageDataBytes: 128 * 1000, // 128KB
  },

  env: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http', // Only if needed
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 300, // Increase to 5 minutes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.");
    }
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn("Warning: NEXT_PUBLIC_API_BASE_URL environment variable is not set.");
    }

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Add specific headers for image optimization
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=31536000' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/socket/io',
        destination: 'http://localhost:3001/api/socket/io',
      },
    ];
  },
};

export default nextConfig;