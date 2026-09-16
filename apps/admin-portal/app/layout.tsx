import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Admin Portal — bldr', template: '%s | Admin' },
  description: 'bldr Admin Portal',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
