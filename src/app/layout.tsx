// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import '@/styles/globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext'; // 1. ИМПОРТИРУЕМ ПРОВАЙДЕР

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | TopCar Almaty',
    default: 'TopCar - Премиум Аренда Авто в Алматы',
  },
  description: 'Эксклюзивный автопарк премиум-класса в Алматы. VIP-сервис, трансферы, аренда с водителем и без. Ваш безупречный стиль начинается здесь.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TopCar Almaty',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${manrope.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {/* 2. ОБОРАЧИВАЕМ ВСЕ КОМПОНЕНТЫ В ПРОВАЙДЕР */}
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
        </AuthProvider>
      </body>
    </html>
  );
}