import '~/styles/globals.css';

import type { Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { GeistSans } from 'geist/font/sans';

import { TRPCReactProvider } from '~/trpc/react';
import { Toaster } from '~/components/ui/sonner';
import { Footer } from '~/components/footer';

export const viewport: Viewport = {
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: shadcn }}>
      <TRPCReactProvider>
        <html lang="en" className={`${GeistSans.variable} dark`}>
          <body>
            <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
              <div className="min-h-screen">{children}</div>

              <Footer />
            </div>

            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
