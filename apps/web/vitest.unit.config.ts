import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    name: 'unit',
    environment: 'jsdom',
    include: ['**/*.unit.spec.ts', '**/*.unit.spec.tsx'],
    exclude: ['node_modules', '.next', 'dist', 'tests/e2e'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      include: ['app/**', 'features/**', 'components/**', 'lib/**', 'styles/**', 'scripts/**'],
      exclude: [
        '**/*.unit.spec.ts',
        '**/*.unit.spec.tsx',
        '**/*.integration.spec.ts',
        '**/*.integration.spec.tsx',
        '**/*.e2e.spec.ts',
        '**/types/**',
        '**/*.config.ts',
        '**/next-env.d.ts',
        'app/**/page.tsx',
        'app/**/layout.tsx',
        'lib/search/types.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@features': resolve(__dirname, './features'),
      '@components': resolve(__dirname, './components'),
      '@lib': resolve(__dirname, './lib'),
      'next/font/google': resolve(__dirname, './__mocks__/next-font-google.ts'),
      'next/font/local': resolve(__dirname, './__mocks__/next-font-local.ts'),
      'next/navigation': resolve(__dirname, './__mocks__/next-navigation.ts'),
      'next/script': resolve(__dirname, './__mocks__/next-script.tsx'),
    },
  },
});
