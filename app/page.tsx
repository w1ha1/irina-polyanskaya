'use client';

import { useEffect } from 'react';

// Static export can't use next/navigation's redirect() or next.config
// redirects (both require a server, unsupported with output: 'export'), so
// the root -> /ru redirect has to happen client-side. BASE_PATH is baked in
// at build time via next.config's `env` (see there) — plain string
// concatenation because this is a raw <a>/window.location target, not a
// next/link href, so it doesn't get basePath applied automatically.
const ruHref = `${process.env.BASE_PATH ?? ''}/ru/`;

export default function RootRedirect() {
  useEffect(() => {
    window.location.replace(ruHref);
  }, []);

  return (
    <p style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      Redirecting to <a href={ruHref}>the Russian version</a>…
    </p>
  );
}
