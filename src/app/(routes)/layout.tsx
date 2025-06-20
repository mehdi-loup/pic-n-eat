'use client';
import DesktopNav from '@/components/DesktopNav';
import MobileNav from '@/components/MobileNav';
import ThemeObserver from '@/components/ThemeObserver';
import { Theme } from '@radix-ui/themes';
import localFont from 'next/font/local';
import '../globals.css';
import '@radix-ui/themes/styles.css';
import Providers from '../providers';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="text/javascript"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          async
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black dark:text-red-500`}
      >
        <Theme>
          <div className="flex min-h-screen dark:bg-gray-800 dark:text-gray-300">
            <DesktopNav />
            <div className="pb-24 ld:pb-4 pt-4 px-4 lg:px-8 flex justify-around w-full">
              <div className="w-full content-center justify-items-center">
                <Providers>{children}</Providers>
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
