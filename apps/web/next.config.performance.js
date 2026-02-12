/**
 * Image Optimization Configuration
 *
 * This file contains configuration for Next.js Image optimization
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable image optimization
    formats: ["image/webp", "image/avif"],

    // Image domains (add your image CDN domains here)
    domains: ["localhost", "images.unsplash.com", "via.placeholder.com"],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache time for optimized images (1 year)
    minimumCacheTTL: 31536000,

    // Disable static image imports if needed
    disableStaticImages: false,
  },

  // Enable compression
  compress: true,

  // Enable React strict mode
  reactStrictMode: true,

  // Enable SWC minification
  swcMinify: true,

  // Experimental features
  experimental: {
    // Enable optimizeCss
    optimizeCss: true,

    // Enable optimizePackageImports for better tree-shaking
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

module.exports = nextConfig;
