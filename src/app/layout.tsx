import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Land Finder — Off-Market Acquisition',
  description: 'Off-market finished lot land screening platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
