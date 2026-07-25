import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/session-provider';
import { ToastThemeProvider } from '@/components/providers/toast-theme-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
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
        className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans h-full bg-background text-foreground antialiased`}
      >
        <ToastThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastThemeProvider>
      </body>
    </html>
  );
}
