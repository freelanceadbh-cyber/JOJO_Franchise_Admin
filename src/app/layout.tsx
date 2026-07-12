import type { Metadata } from 'next';
import { Poppins, League_Spartan } from 'next/font/google';
import { AuthProvider } from '@/components/providers/session-provider';
import { ToastThemeProvider } from '@/components/providers/toast-theme-provider';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const leagueSpartan = League_Spartan({
  variable: '--font-spartan',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="en" className="h-full">
      <body
        className={`${poppins.variable} ${leagueSpartan.variable} font-sans h-full bg-background text-foreground antialiased`}
      >
        <ToastThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastThemeProvider>
      </body>
    </html>
  );
}
