import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@arun-dev/ui'],
  turbopack: {
    root: resolve(__dirname, '../../'),
  },
};

export default nextConfig;
