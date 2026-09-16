import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Provider Portal — bldr', template: '%s | Provider Portal' },
  description: 'bldr Provider Portal — manage your listings, orders, leads, and payouts.',
  robots: 'noindex',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
