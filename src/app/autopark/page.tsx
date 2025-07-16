// src/app/autopark/page.tsx
'use client';
// 'useEffect' и 'useState' УДАЛЕНЫ

export const dynamic = 'force-dynamic'
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import CarCatalog from "@/components/CarCatalog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from 'react';

export default function AutoparkPage() {
  return (
    <AnimatedPageWrapper>
      <Header />
      <main className="bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4">
            Наш <span className="text-brand-accent">Автопарк</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Выберите идеальный автомобиль для вашей следующей поездки. Мы предлагаем широкий выбор моделей, от элегантных седанов до мощных внедорожников.
          </p>
          <Suspense fallback={<div className="text-center">Загрузка каталога...</div>}>
            <CarCatalog />
          </Suspense>
        </div>
      </main>
      <Footer />
    </AnimatedPageWrapper>
  );
}