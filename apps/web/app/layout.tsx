import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arun Dev Platform',
  description:
    'A high-performance, agent-first developer platform showcasing engineering excellence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
