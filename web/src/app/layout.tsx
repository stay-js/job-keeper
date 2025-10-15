import '~/styles/globals.css';

import { type Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { TRPCReactProvider } from '~/trpc/react';
import { Toaster } from '~/components/ui/sonner';
import { Footer } from '~/components/footer';

export const viewport: Viewport = {
  colorScheme: 'dark',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProvider appearance={{ baseTheme: dark }}>
    <TRPCReactProvider>
      <html lang="en" className={`${GeistSans.variable} dark`}>
        <body className="bg-neutral-950 text-white">
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

export default RootLayout;
