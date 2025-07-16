// src/app/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import CarCatalog from '@/components/CarCatalog'
import ServicesSection from '@/components/ServicesSection'
import RentalCalculator from '@/components/RentalCalculator'
import FAQ from '@/components/FAQ'
import Subscription from '@/components/Subscription'
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon, // ← ЭТОГО явно не хватает!
} from '@heroicons/react/24/outline'



// ... (функция subscribeToPush остается без изменений)
async function subscribeToPush() {
  try {
    const registration = await navigator.serviceWorker.ready
    await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })
    console.log('Push subscription successful');
  } catch (err) {
    console.error('🔔 Push subscription failed', err)
  }
}


// Варианты анимации для контейнера
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Варианты анимации для дочерних элементов
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1], // Это изменение уже было сделано для framer-motion ошибки
    },
  },
};

export default function HomePage() {
  const [loggedInUser, setLoggedInUser] = useState<{ phone: string; name?: string; email?: string } | null>(null);

  const updateUserFromStorage = useCallback(() => {
    const storedUser = localStorage.getItem('topcar-user');
    if (storedUser) {
      try {
        setLoggedInUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('topcar-user');
        setLoggedInUser(null);
      }
    } else {
        setLoggedInUser(null);
    }
  }, []);

  useEffect(() => {
    updateUserFromStorage();
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          subscribeToPush()
        }
      })
    }
  }, [updateUserFromStorage]);

  const scrollToCatalog = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    document.getElementById('car-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatedPageWrapper>
      {/* --- Hero Section --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <video
          src="/videos/hero-rolls.mp4"
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover filter brightness-75"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />

        <motion.div
          className="relative z-10 px-4 max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm bg-border text-brand-accent rounded-full"
            variants={itemVariants}
          >
            <SparklesIcon className="h-4 w-4" />
            <span>Премиум-сервис в Алматы</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight text-white animate-fadeInUp">
            Владей Моментом. <br className="hidden sm:block" /> Арендуй <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f0dca0] to-[#d4af37]">Роскошь</span>.
          </h1>
          <p className="mt-6 md:mt-8 text-lg sm:text-2xl text-neutral-200 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
            Эксклюзивный автопарк премиум-класса в Алматы. Ваш безупречный стиль начинается здесь.
          </p>
          
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fadeInUp animation-delay-600">
            <a
              href="#car-catalog"
              onClick={scrollToCatalog}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-[#d4af37] text-black rounded-lg text-lg font-bold hover:bg-[#c0982c] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>Исследовать Автопарк</span>
              <ArrowRightIcon className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>

            {loggedInUser ? (
              <Link
                href="/dashboard"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                <UserCircleIcon className="mr-2 h-6 w-6" />
                <span>Личный кабинет</span>
              </Link>
            ) : (
              <a
                href="https://wa.me/77776660295"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                <ChatBubbleLeftRightIcon className="mr-2 h-6 w-6" />
                <span>Связаться</span>
              </a>
            )}
          </div>
        </motion.div>
        {/* Удалена пустая строка здесь, чтобы избежать потенциальной ошибки синтаксиса */}
        <div // Это блок для стрелки прокрутки вниз
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer hidden sm:block"
          onClick={scrollToCatalog}
          aria-label="Прокрутить вниз"
        >
          <ArrowDownIcon className="h-8 w-8 text-white/70 hover:text-white" />
        </div>
      </section>

      {/* --- Остальные секции --- */}
      <CarCatalog />
      <ServicesSection />
      <RentalCalculator />
      <FAQ />
      <Subscription />
    </AnimatedPageWrapper>
  )
}