import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AuthProvider } from '@/components/providers/session-provider';
import { ToastThemeProvider } from '@/components/providers/toast-theme-provider';
import './globals.css';

const oceanwide = localFont({
  src: [
    {
      path: '../../public/fonts/Oceanwide-Semibold.otf',
      weight: '400 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Oceanwide-SemiboldOblique.otf',
      weight: '400 900',
      style: 'italic',
    },
  ],
  variable: '--font-oceanwide',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JoJo Ice Creams - Franchise Portal',
  description: 'B2B Franchise Management Portal for JoJo Ice Creams - order products, track logistics, verify payments and invoices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${oceanwide.variable} font-sans h-full bg-background text-foreground antialiased`}
      >
        <ToastThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastThemeProvider>
      </body>
    </html>
  );
}
