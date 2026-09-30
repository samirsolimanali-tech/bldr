import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'bldr Platform Admin', template: '%s | bldr Platform Admin' },
  description: 'bldr Platform Admin Portal — Catalog, Content, Students CRM & Multi-Brand Operations',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
