import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_GEIDEA_JS_URL: process.env.GEIDEA_CHECKOUT_JS_URL || 'https://checkout-demo.geidea.net/geideaCheckout.min.js',
  },
};

export default nextConfig;
