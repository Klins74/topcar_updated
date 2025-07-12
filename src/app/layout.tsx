// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google' // ИЗМЕНЕНИЕ: импортируем Manrope
import { GoogleAnalytics } from '@next/third-parties/google'
import '@/styles/globals.css'

// ИЗМЕНЕНИЕ: Настраиваем новый шрифт
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'TopCar',
  description: 'Премиальная аренда автомобилей в Алматы. Ваш эксклюзивный доступ к роскоши на колесах.',
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
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E0B84C' }, // ИЗМЕНЕНИЕ: новый цвет акцента
    { media: '(prefers-color-scheme: dark)', color: '#111111' }, // ИЗМЕНЕНИЕ: новый темный цвет
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ИЗМЕНЕНИЕ: Применяем новый шрифт ко всему сайту
    <html lang="ru" className={`${manrope.variable} font-sans`}>
      <head />
      <body className="antialiased bg-background text-foreground">
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
