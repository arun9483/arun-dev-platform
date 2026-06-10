import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { THEME_SCRIPT } from '@/styles/themes/theme-script';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const inter = localFont({
  src: [
    {
      path: '../node_modules/@arun-dev/tokens/src/fonts/inter-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../node_modules/@arun-dev/tokens/src/fonts/inter-latin-wght-italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Arun Dev Platform',
    template: '%s — Arun Dev Platform',
  },
  description:
    'A high-performance, agent-first developer platform showcasing engineering excellence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body>
        {/* Inline FOUC prevention: reads localStorage before first paint */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
