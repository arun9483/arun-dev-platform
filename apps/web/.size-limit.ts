import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Per-route first-load JS budgets (gzip), blocking in CI (performance.yml).
// Turbopack emits flat hashed chunk names with no per-route manifest, so each
// route's first-load chunk list is read from its prerendered HTML script tags.
// Budget ratchet: measured 204–215 KB on 2026-06-12; cap from the quality plan
// is 300 KB — budgets are tightened quarterly, never silently raised.

type SizeLimitEntry = {
  name: string;
  path: string[];
  limit: string;
  gzip: boolean;
};

const ROUTE_BUDGET = '250 KB';

const routes: Record<string, string> = {
  '/': 'index.html',
  '/projects': 'projects.html',
  '/projects/arun-dev-platform': 'projects/arun-dev-platform.html',
  '/articles': 'articles.html',
  '/articles/react-server-components-deep-dive': 'articles/react-server-components-deep-dive.html',
  '/search': 'search.html',
  '/achievements': 'achievements.html',
};

function firstLoadChunks(htmlFile: string): string[] {
  const html = readFileSync(join(__dirname, '.next/server/app', htmlFile), 'utf8');
  const refs = html.match(/\/_next\/static\/chunks\/[^"]+\.js/g) ?? [];
  return [...new Set(refs)].map((ref) => join(__dirname, '.next', ref.replace('/_next/', '')));
}

const config: SizeLimitEntry[] = Object.entries(routes).map(([route, htmlFile]) => ({
  name: `first-load JS ${route}`,
  path: firstLoadChunks(htmlFile),
  limit: ROUTE_BUDGET,
  gzip: true,
}));

export default config;
