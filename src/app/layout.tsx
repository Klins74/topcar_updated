// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import '@/styles/globals.css';

import { AuthProvider } from '@/context/AuthContext';
// Компоненты Header и Footer больше не нужно импортировать здесь, 
// так как они будут рендериться внутри дочерних страниц (например, page.tsx)
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';


// 1. Упрощаем настройку шрифта, убирая 'variable'
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
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
    // 2. Применяем класс шрифта напрямую к <html>. Это лучший способ.
    <html lang="ru" className={manrope.className}>
      {/* 3. Убрали лишние классы из body, так как шрифт наследуется от html */}
      <body className="bg-background text-foreground">
        <AuthProvider>
          {/* Header и Footer теперь должны быть частью дочерних компонентов, 
            а не этого корневого макета, чтобы избежать проблем с 
            передачей пропсов от страниц (как onLoginClick).
            Next.js рендерит {children}, и внутри этого {children} 
            уже будет ваша страница (page.tsx) со своим Header и Footer.
          */}
          {children}
          
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
