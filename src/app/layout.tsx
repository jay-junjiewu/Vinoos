
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, modern font
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Changed from Geist to Inter for variety, can revert if Geist is preferred
});

export const metadata: Metadata = {
  title: 'Vinoos',
  description: 'Beautiful custom fish tank builds and quality aquarium equipment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
