// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import Script from 'next/script'; // <-- Импортируем компонент Script
import '@/styles/globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { LocaleProvider } from '@/context/LocaleContext';

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
        {/* --- Google tag (gtag.js) --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RN8FMGTC04"
          strategy="beforeInteractive"
        />
        <Script id="ga4-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-RN8FMGTC04');
          `}
        </Script>
        {/* --- End Google tag (gtag.js) --- */}

        {/* --- SEO: alternate, canonical, language redirect --- */}
        <link rel="alternate" href="https://topcar.club/" hrefLang="ru" />
        <link rel="alternate" href="https://topcar.club/en/" hrefLang="en" />
        <link rel="alternate" href="https://topcar.club/kk/" hrefLang="kk" />
        <link rel="canonical" href="https://topcar.club/" />
        <Script id="lang-redirect" strategy="afterInteractive">
          {`
            document.addEventListener("DOMContentLoaded", function() {
              var userLang = navigator.language || navigator.userLanguage;
              if (userLang.startsWith("en")) {
                window.location.href = "https://topcar.club/en/";
              } else if (userLang.startsWith("kk")) {
                window.location.href = "https://topcar.club/kk/";
              }
            });
          `}
        </Script>
        {/* --- END SEO --- */}
      </head>
      <body className="bg-background text-foreground">

        <LocaleProvider locale="ru">
          <AuthProvider>
            {children}
          </AuthProvider>
        </LocaleProvider>

        {/* --- WhatsApp Widget (edna) --- */}
        <Script id="whatsapp-widget" strategy="afterInteractive">
          {`
            (function(){
              var url = 'https://edna.ru/wp-content/plugins/whatsapp-widget-generator/js/generator-ru.js?5545';
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src = url;
              var options = {
                "host":"https://edna.ru",
                "enabled":true,
                "chatButtonSetting":{
                    "backgroundColor":"#00e118",
                    "ctaText":"Написать в Whatsapp",
                    "icon":"whatsapp",
                    "position":"right",
                },
                "brandSetting":{
                    "backgroundColor":"#2a5a53",
                    "brandImg":"",
                    "brandName":"TopCar",
                    "brandSubTitle":"Ответим моментально",
                    "ctaText":"Whatsapp",
                    "phoneNumber":"77776660295",
                    "welcomeText":"Здравствуйте!"
                }
              };
              s.onload = function() {
                  if (typeof CreateWhatsappChatWidget === 'function') {
                    CreateWhatsappChatWidget(options);
                  }
              };
              var x = document.getElementsByTagName('script')[0];
              x.parentNode && x.parentNode.insertBefore(s, x);
            })();
          `}
        </Script>
        {/* --- END WhatsApp Widget (edna) --- */}
      </body>
    </html>
  );
}