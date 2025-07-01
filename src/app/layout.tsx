
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import SecurityProvider from '@/components/security-provider';
import { AuthProvider } from '@/context/auth-provider';
import './globals.css';
import './animations.css';

export const metadata: Metadata = {
  title: "Ritesh's Portfolio",
  description: 'A personal portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased transition-colors duration-500 ease-in-out overflow-x-hidden">
        <AuthProvider>
          <SecurityProvider>
            {children}
          </SecurityProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
