// src/app/autopark/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarCatalog from '@/components/CarCatalog' // Мы будем использовать тот же компонент каталога
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'

export default function AutoparkPage() {

  // Эта страница теперь служит в основном как "обертка" или контейнер
  // для шапки, подвала и самого каталога. 
  // Вся логика загрузки и отображения машин инкапсулирована в CarCatalog.

  return (
    <AnimatedPageWrapper>
      <main className="min-h-screen bg-neutral-950 text-white font-sans">
        <Header />
        
        {/* Вставляем наш уже готовый и работающий компонент каталога */}
        <div className="pt-20 sm:pt-24">
          <CarCatalog />
        </div>
        
        <Footer />
      </main>
    </AnimatedPageWrapper>
  )
}