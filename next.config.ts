import type { NextConfig } from 'next';

// GitHub Pages serves this repo at /irina-polyanskaya/, not the domain root, so
// every asset/link needs that prefix baked in — but only for the real deploy.
// Locally (`npm run dev`/`build`, and the e2e suite's `next start`) this stays
// empty so the site keeps living at plain `/` like before, unaffected by the
// GitHub Pages path. `GITHUB_ACTIONS` is set automatically by every GH Actions
// runner, so this only turns on inside the deploy workflow.
const basePath = process.env.GITHUB_ACTIONS ? '/irina-polyanskaya' : '';

const nextConfig: NextConfig = {
  // Static export: GitHub Pages only serves static files, there's no Node
  // server to run `next start`, rewrites, or the default image optimizer.
  output: 'export',
  basePath,
  // Env var, not literal basePath, because next/link and next/image already
  // apply basePath automatically — this is only for the one place that can't
  // use either (the plain-JS root redirect in app/page.tsx, see there).
  env: { BASE_PATH: basePath },
  // Emits `/ru/index.html` instead of `/ru.html`, so any static file server
  // (GitHub Pages included) resolves `/ru/` the same way it resolves any
  // other directory — no rewrite rules required.
  trailingSlash: true,
  images: { unoptimized: true },
  // Next.js blocks cross-origin requests to dev-only assets by default, which
  // silently breaks client-side hydration (animations, interactivity — all of
  // it) when the dev server is reached via its LAN IP instead of localhost,
  // e.g. testing on a phone over WiFi. This only affects `next dev`; it's a
  // no-op in production. Update the IP here if the machine's LAN address changes.
  allowedDevOrigins: ['192.168.31.230'],
};

export default nextConfig;
