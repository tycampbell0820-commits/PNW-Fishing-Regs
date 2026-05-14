import type { ReactNode } from 'react';

export const metadata = {
  title: 'PNW Fish Guide',
  description: 'Pacific Northwest fishing regulations, species ID, and tips for WA state',
  manifest: '/fishing-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fish Guide',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1a9e7c',
};

export default function FishingLayout({ children }: { children: ReactNode }) {
  return children;
}
