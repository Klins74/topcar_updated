// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script'; // <-- Импортируем компонент Script
import '@/styles/globals.css';

import { AuthProvider } from '@/context/AuthContext';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | TopCar Almaty',
    default: 'TopCar - Премиум Аренда Авто в Алматы | Elite Cars Rental',
  },
  description: 'Эксклюзивный автопарк премиум-класса в Алматы: элитные авто, электрокары, luxury cars для туристов. VIP-сервис, трансферы, аренда с водителем и без. Premium car rental, elite vehicles, electric cars for tourists in Almaty.',
  keywords: 'аренда авто Алматы, элитные авто, премиум автомобили, электрокары, для туристов, car rental Almaty, luxury cars, premium vehicles, elite cars, electric cars, VIP service, трансфер аэропорт',
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
    <html lang="ru" className={manrope.className}>
      <head>
        {/* --- Google Tag Manager --- */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NCJ66Z6W');
          `}
        </Script>
        {/* --- End Google Tag Manager --- */}
      </head>
      <body className="bg-background text-foreground">
        {/* --- Google Tag Manager (noscript) --- */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NCJ66Z6W"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* --- End Google Tag Manager (noscript) --- */}

        <AuthProvider>
          {children}
          
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
        </AuthProvider>
      </body>
    </html>
  );
}