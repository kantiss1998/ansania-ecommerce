import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@repo/shared', '@repo/ui'],
    env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        domains: ['localhost'],
    },
};

export default nextConfig;
