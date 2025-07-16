// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css' // Corrected path from previous step
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'
import PWABonus from '@/components/PWABonus'
import { AuthProvider } from '@/components/AuthProvider' // Import AuthProvider

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TopCar Club – аренда авто в Алматы',
  description: 'Аренда автомобилей в Алматы: бизнес, комфорт, эконом. Прозрачные цены, онлайн-бронирование.',
  keywords: ['аренда авто алматы', 'прокат машин', 'car rental almaty', 'topcar club'],
  openGraph: {
    title: 'TopCar Club – аренда авто в Алматы',
    description: 'Премиальная аренда авто в Алматы. Онлайн-расчет стоимости, быстрая бронь.',
    url: 'https://topcar.club',
    siteName: 'TopCar Club',
    images: [
      {
        url: 'https://topcar.club/og-image.jpg', // замени на актуальную
        width: 1200,
        height: 630,
        alt: 'TopCar Club',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <PWABonus />
        <Header />
        <AuthProvider> {/* Wrap children with AuthProvider */}
          <AnimatedPageWrapper>
            <main>
              {children}
            </main>
          </AnimatedPageWrapper>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
}