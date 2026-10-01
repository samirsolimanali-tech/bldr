import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/apply-provider',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
