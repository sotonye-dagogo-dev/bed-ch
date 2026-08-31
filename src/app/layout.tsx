import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/layout/TrustBar';
import { AnalyticsProviders } from '@/components/analytics/AnalyticsProviders';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Bedroom Chapters — Everything Your Bedroom Needs',
    template: '%s | Bedroom Chapters',
  },
  description: 'Shop quality bedding, pillows, rugs, curtains, and bedroom essentials. Pay on delivery in Lagos, Abuja & PH. Same-day delivery in Lagos. 7-day returns.',
  keywords: ['bedding', 'pillows', 'rugs', 'curtains', 'bedroom decor', 'nigeria', 'pay on delivery', 'bedsheets', 'duvets'],
  authors: [{ name: 'Bedroom Chapters' }],
  creator: 'Bedroom Chapters',
  publisher: 'Bedroom Chapters',
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Bedroom Chapters',
    title: 'Bedroom Chapters — Everything Your Bedroom Needs',
    description: 'Shop quality bedding, pillows, rugs, curtains, and bedroom essentials. Pay on delivery in Lagos, Abuja & PH. Same-day delivery in Lagos. 7-day returns.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bedroom Chapters - Quality bedroom essentials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bedroom Chapters — Everything Your Bedroom Needs',
    description: 'Shop quality bedding, pillows, rugs, curtains, and bedroom essentials.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#8FBC8F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG" className={`${inter.variable} font-sans antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://static.hotjar.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <AnalyticsProviders />
        <CartProvider>
          <Header />
          <main className="flex-1 pt-16 pb-20 md:pb-0" id="main-content">
            {children}
          </main>
          <Footer />
          <TrustBar />
        </CartProvider>
      </body>
    </html>
  );
}