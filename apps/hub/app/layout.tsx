import type { Metadata } from 'next';
import './globals.css';
import HubAuthGuard from '../components/HubAuthGuard';
import EnvironmentBanner from '../components/EnvironmentBanner';

export const metadata: Metadata = {
  title: {
    default: 'Bldr Central Hub — Financial Operations',
    template: '%s | Bldr Hub',
  },
  description: 'Central payment and financial operations hub for managing ventures, transactions, payouts, and API integrations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EnvironmentBanner />
        <HubAuthGuard>{children}</HubAuthGuard>
      </body>
    </html>
  );
}
