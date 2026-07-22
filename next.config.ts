import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js blocks cross-origin requests to dev-only assets by default, which
  // silently breaks client-side hydration (animations, interactivity — all of
  // it) when the dev server is reached via its LAN IP instead of localhost,
  // e.g. testing on a phone over WiFi. This only affects `next dev`; it's a
  // no-op in production. Update the IP here if the machine's LAN address changes.
  allowedDevOrigins: ['192.168.31.230'],
  async rewrites() {
    return [
      { source: '/', destination: '/ru' },
      { source: '/gallery', destination: '/ru/gallery' },
    ];
  },
};

export default nextConfig;
