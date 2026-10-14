/**
 * Subpath where the site is served. GitHub Pages serves this repo under `/walk-forward-landing`;
 * set it to "" when moving to WNPower, which serves the site at the domain root.
 *
 * Used by `next.config.ts` (basePath) and prefixed by hand to `next/image` sources, which
 * Next.js does not prefix automatically.
 */
export const BASE_PATH = "/walk-forward-landing";
