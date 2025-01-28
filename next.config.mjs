/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image handling configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allows all paths under the domain
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // Optional: Add device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optional: Add image sizes for fixed-width images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Caching headers configuration
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          // Modified cache control for better flexibility
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
        // Additional security headers
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
    },
    // Specific caching for static assets
    {
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  // Optional: Add performance optimization
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;