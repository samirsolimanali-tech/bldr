import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Central Payment Hub — bldr', template: '%s | Payment Hub' },
  description: 'bldr Central Payment Hub — Executive Overview, Ventures, Payment Links & Ledger',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
