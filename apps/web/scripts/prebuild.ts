import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const MONOREPO_ROOT = resolve(__dirname, '../../..');
export const TOKENS_DIR = join(MONOREPO_ROOT, 'packages', 'tokens');
export const OUTPUT_PATH = resolve(__dirname, '../styles/brand.css');

export type FsOps = {
  existsSync: (path: string) => boolean;
  mkdirSync: (path: string, opts: { recursive: boolean }) => void;
  readFileSync: (path: string, encoding: 'utf-8') => string;
  writeFileSync: (path: string, content: string) => void;
};

const defaultFs: FsOps = { existsSync, mkdirSync, readFileSync, writeFileSync };

export function resolveBrandCssPath(brand: string, tokensDir: string): string {
  return join(tokensDir, 'src', 'brands', `${brand}.css`);
}

export function buildBrandCss(
  brand: string,
  tokensDir: string,
  outputPath: string,
  fs: FsOps = defaultFs,
): void {
  const basePath = join(tokensDir, 'src', 'base.css');
  const brandPath = resolveBrandCssPath(brand, tokensDir);

  if (!fs.existsSync(basePath)) {
    throw new Error(
      `Base CSS not found: "${basePath}". ` + `Ensure packages/tokens/src/base.css exists.`,
    );
  }

  if (!fs.existsSync(brandPath)) {
    throw new Error(
      `Brand CSS not found: "${brandPath}". ` +
        `Add a matching file in packages/tokens/src/brands/`,
    );
  }

  const content = fs.readFileSync(basePath, 'utf-8') + '\n' + fs.readFileSync(brandPath, 'utf-8');

  fs.mkdirSync(dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
}

export function runMain(
  brand: string = process.env['NEXT_PUBLIC_BRAND'] ?? 'arun',
  tokensDir: string = TOKENS_DIR,
  outputPath: string = OUTPUT_PATH,
  fs: FsOps = defaultFs,
): void {
  buildBrandCss(brand, tokensDir, outputPath, fs);
}

/* v8 ignore next 3 */
if (process.argv[1] === __filename) {
  runMain();
}
