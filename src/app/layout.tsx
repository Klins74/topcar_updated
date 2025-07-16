// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import '@/styles/globals.css'

// Импорт глобальных компонентов и провайдера аутентификации
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'
import { AuthProvider } from '@/components/AuthProvider' // ВАЖНО: импортируем AuthProvider

// Настраиваем шрифт Manrope
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

// Объединенные и обновленные метаданные для SEO
export const metadata: Metadata = {
  title: 'TopCar Club – аренда авто в Алматы',
  description: 'Аренда автомобилей в Алматы: бизнес, комфорт, эконом. Прозрачные цены, онлайн-бронирование.',
  keywords: ['аренда авто алматы', 'прокат машин', 'car rental almaty', 'topcar club'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icons/icon-192x192-maskable.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512-maskable.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TopCar',
  },
  openGraph: {
    title: 'TopCar Club – аренда авто в Алматы',
    description: 'Премиальная аренда авто в Алматы. Онлайн-расчет стоимости, быстрая бронь.',
    url: 'https://topcar.club',
    siteName: 'TopCar Club',
    images: [
      {
        url: 'https://topcar.club/og-image.jpg', // Замените на актуальный путь к изображению OG
        width: 1200,
        height: 630,
        alt: 'TopCar Club',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
}

// Конфигурация Viewport
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E0B84C' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${manrope.variable} font-sans`}>
      <head />
      <body className="antialiased bg-background text-foreground">
        {/* Все компоненты, которым нужен AuthContext, ДОЛЖНЫ БЫТЬ внутри AuthProvider */}
        <AuthProvider>
          <Header /> {/* Header теперь корректно находится внутри AuthProvider */}
          <AnimatedPageWrapper>
            <main>
              {children}
            </main>
          </AnimatedPageWrapper>
          <Footer /> {/* Footer теперь корректно находится внутри AuthProvider */}
        </AuthProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}