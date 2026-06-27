
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean, modern font
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { Analytics } from '@vercel/analytics/next';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  getLocalBusinessSchema,
  getWebsiteSchema,
} from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Changed from Geist to Inter for variety, can revert if Geist is preferred
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Vinoos Trading EST.',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'business',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#293462',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <JsonLd data={[getLocalBusinessSchema(), getWebsiteSchema()]} />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster /> {/* Add Toaster here */}
        <Analytics />
      </body>
    </html>
  );
}
