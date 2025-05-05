import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import {Toaster} from '@/components/ui/toaster';
import {AppProviders} from '@/components/providers';
import './globals.css';
import Balancer from 'react-wrap-balancer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HelpDesk Lite',
  description: 'A functional helpdesk dashboard website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <AppProviders>
          <Balancer.Provider>
            {children}
            <Toaster />
          </Balancer.Provider>
        </AppProviders>
      </body>
    </html>
  );
}
