import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_GEIDEA_JS_URL: process.env.GEIDEA_CHECKOUT_JS_URL || 'https://checkout-demo.geidea.net/geideaCheckout.min.js',
  },
  async redirects() {
    return [
      {
        source: '/providers/enroll',
        destination: '/apply-provider',
        permanent: true,
      },
      {
        source: '/listings/:id*',
        destination: '/products/:id*',
        permanent: true,
      },
      {
        source: '/orders/:id*/success',
        destination: '/checkout/success',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
