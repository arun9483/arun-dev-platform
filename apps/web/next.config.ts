import type { NextConfig } from 'next';
import { resolve } from 'path';

const SECURITY_HEADERS = [
  // Prevent browsers from guessing MIME types
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block this site being framed by other origins (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Send origin only, not full URL, in Referer header to third parties
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features the portfolio never uses
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS for 1 year once a browser has visited (Vercel is always HTTPS)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  transpilePackages: ['@arun-dev/ui'],
  turbopack: {
    root: resolve(__dirname, '../../'),
  },
  // Remove the X-Powered-By: Next.js fingerprint header
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
