import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { THEME_SCRIPT } from '@/styles/themes/theme-script';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline FOUC prevention: reads localStorage before first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${inter.variable} min-h-screen antialiased flex flex-col bg-primary`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
