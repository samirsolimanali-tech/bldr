import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'bldr — Multi-Vendor Service Marketplace',
    template: '%s | bldr',
  },
  description:
    'Discover expert service providers across education, media, consulting, marketing and more. Compare, book, and buy with confidence on bldr.',
  keywords: ['marketplace', 'services', 'education', 'consulting', 'media production'],
  openGraph: {
    siteName: 'bldr',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
