import '~/styles/globals.css';

import { type Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ClerkProvider } from '@clerk/nextjs';
import { TRPCReactProvider } from '~/trpc/react';

export const viewport: Viewport = {
  colorScheme: 'dark',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProvider>
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="bg-neutral-950 text-white">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
