'use client';
import DesktopNav from '@/components/DesktopNav';
import MobileNav from '@/components/MobileNav';
import ThemeObserver from '@/components/ThemeObserver';
import { Theme } from '@radix-ui/themes';
import localFont from 'next/font/local';
import '../globals.css';
import '@radix-ui/themes/styles.css';
import { type PrivyClientConfig, PrivyProvider } from '@privy-io/react-auth';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const config: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black dark:text-red-500`}
      >
        <Theme>
          {modal}
          <div className="flex min-h-screen dark:bg-gray-800 dark:text-gray-300">
            <DesktopNav />
            <div className="pb-24 ld:pb-4 pt-4 px-4 lg:px-8 flex justify-around w-full">
              <div className="w-full">
                <PrivyProvider
                  appId="cmbp3dj6t0098l70nklpgx4i2"
                  clientId="client-WY6MC3d5SKAJj82fBQtzhKXRW9nqFuGL9A4v8H6W7DME9"
                  config={config}
                >
                  {children}
                </PrivyProvider>
              </div>
            </div>
          </div>
          <MobileNav />
        </Theme>
        <ThemeObserver />
      </body>
    </html>
  );
}
