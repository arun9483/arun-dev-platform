import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    '../../apps/web/app/**/*.{ts,tsx}',
    '../../apps/web/components/**/*.{ts,tsx}',
    '../../apps/web/features/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffd',
          300: '#7cc5fc',
          400: '#36a9f8',
          500: '#0c8ee9',
          600: '#0070c7',
          700: '#0059a2',
          800: '#054c85',
          900: '#0a406f',
          950: '#07294a',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
