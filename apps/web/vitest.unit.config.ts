import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    name: 'unit',
    environment: 'jsdom',
    include: ['**/*.unit.spec.ts', '**/*.unit.spec.tsx'],
    exclude: ['node_modules', '.next', 'dist', 'tests/e2e'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
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
