import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { TRPCReactProvider } from '~/trpc/react';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en" className={`${GeistSans.variable} dark`}>
    <body className="bg-neutral-950">
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </body>
  </html>
);

export default RootLayout;
