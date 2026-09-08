// next/image with `unoptimized: true` (required for static export — see
// next.config.ts) renders `src` verbatim. Unlike next/link and the metadata
// icon route, it does not prepend basePath on its own, so local image paths
// need it added by hand. BASE_PATH is baked in at build time via next.config's
// `env` — empty locally, `/irina-polyanskaya` only in the GitHub Actions build.
export function withBasePath(path: string): string {
  return `${process.env.BASE_PATH ?? ''}${path}`;
}
