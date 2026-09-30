import type { Metadata } from 'next';
import './globals.css';
import ProviderAuthGuard from '../components/ProviderAuthGuard';

export const metadata: Metadata = {
  title: { default: 'Provider Portal — bldr', template: '%s | Provider Portal' },
  description: 'bldr Provider Portal — manage your listings, orders, leads, and payouts.',
  robots: 'noindex',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProviderAuthGuard>{children}</ProviderAuthGuard>
      </body>
    </html>
  );
}
