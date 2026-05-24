import type { Metadata } from 'next';
import { THEME_SCRIPT } from '@/styles/themes/theme-script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arun Dev Platform',
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
