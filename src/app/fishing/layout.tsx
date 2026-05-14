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
  other: {
    // iOS Safari: treat as standalone app when added to home screen
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Fish Guide',
    // Prevent phone number detection from mangling size/weight numbers
    'format-detection': 'telephone=no',
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
