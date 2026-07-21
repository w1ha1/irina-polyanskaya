import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/ru' },
      { source: '/gallery', destination: '/ru/gallery' },
    ];
  },
};

export default nextConfig;
