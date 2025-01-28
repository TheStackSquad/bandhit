/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimizations
  images: {
    domains: ["res.cloudinary.com"], // Trusted domains
    formats: ["image/avif", "image/webp"], // Supported formats
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },

  // Custom headers for caching
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;
