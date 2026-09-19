import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  // Integration specs may render components (.tsx), not just call loaders.
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    name: 'integration',
    environment: 'jsdom',
    include: ['**/*.integration.spec.ts', '**/*.integration.spec.tsx'],
    exclude: ['node_modules', '.next', 'dist', 'tests/e2e'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      // Ratchet thresholds — set just below measured coverage (2026-06-12:
      // 13.94% lines, 61.53% branches, 61.03% functions). Raise as integration
      // coverage grows; never lower without a reviewed justification.
      // Re-baselined 2026-09-19 for vitest 4, whose AST-aware v8 remapping
      // counts real branches/functions in untested files (same tests, v3 → v4:
      // branches 63.63% → 18.51%, functions 62.65% → 36.02%).
      thresholds: {
        lines: 28,
        statements: 28,
        branches: 18,
        functions: 36,
      },
      include: ['app/**', 'features/**', 'components/**', 'lib/**'],
      exclude: [
        '**/*.unit.spec.ts',
        '**/*.unit.spec.tsx',
        '**/*.integration.spec.ts',
        '**/*.integration.spec.tsx',
        '**/*.e2e.spec.ts',
        '**/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@features': resolve(__dirname, './features'),
      '@components': resolve(__dirname, './components'),
      '@lib': resolve(__dirname, './lib'),
    },
  },
});
