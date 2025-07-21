'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CarCatalog from '@/components/CarCatalog';
import ServicesSection from '@/components/ServicesSection';
import FAQ from '@/components/FAQ';
import Subscription from '@/components/Subscription';
import Footer from '@/components/Footer';
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper';
import LoginModal from '@/components/LoginModal';
import { ArrowRightIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- ИЗМЕНЕНИЕ: Неиспользуемая функция удалена ---
  // const handleLoginButtonClick = () => {
  //   setShowLoginModal(true);
  // };

  const scrollToCatalog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const catalogSection = document.getElementById('car-catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatedPageWrapper>
      <main className="min-h-screen bg-neutral-950 text-white font-sans">
       <Header />

        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

        <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          <video
            src="/videos/hero-rolls.mp4"
            className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-125"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />

          <div className="relative z-10 px-4 sm:px-6 max-w-4xl lg:max-w-5xl text-shadow-strong">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-tight md:leading-snug text-white animate-fadeInUp">
              Владей Моментом. <br className="hidden sm:block" /> Арендуй <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f0dca0] to-[#d4af37]">Роскошь</span>.
            </h1>
            <p className="mt-6 md:mt-8 text-lg sm:text-xl lg:text-2xl text-neutral-200 max-w-xl lg:max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              Эксклюзивный автопарк премиум-класса в Алматы. Ваш безупречный стиль начинается здесь.
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fadeInUp animation-delay-600">
              <a
                href="#car-catalog"
                onClick={scrollToCatalog}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-[#d4af37] text-black rounded-lg text-base sm:text-lg font-bold hover:bg-[#c0982c] transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>Исследовать Автопарк</span>
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-6 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <div className="w-full sm:w-auto">
                {isMounted && !isLoading && (
                  user ? (
                    <Link href="/dashboard" className="group relative w-full inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 border-2 border-[#d4af37] text-[#d4af37] rounded-lg text-base sm:text-lg font-bold hover:bg-[#d4af37] hover:text-black transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0">
                      <UserCircleIcon className="mr-2 -ml-1 h-6 w-6 transition-colors duration-300 group-hover:text-black" />
                      <span>Личный кабинет</span>
                    </Link>
                  ) : (
                    <a href="https://wa.me/77776660295" target="_blank" rel="noopener noreferrer" className="group relative w-full inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 border-2 border-white text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0">
                      <ChatBubbleLeftRightIcon className="mr-2 -ml-1 h-6 w-6 transition-colors duration-300 group-hover:text-black" />
                      <span>Связаться</span>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <CarCatalog />
        <ServicesSection />
        <FAQ />
        <Subscription />
        <Footer />
      </main>
    </AnimatedPageWrapper>
  );
}