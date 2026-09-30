import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Bldr — Build. Launch. Scale.',
    template: '%s | Bldr',
  },
  description:
    'Bldr is a premium platform delivering world-class digital products, services, and solutions. We help businesses build, launch, and scale with confidence.',
  keywords: ['bldr', 'digital products', 'software', 'services', 'agency'],
  openGraph: {
    siteName: 'Bldr',
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
