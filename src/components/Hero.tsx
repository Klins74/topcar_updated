// src/components/Hero.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

// Варианты анимации для контейнера, чтобы дочерние элементы появлялись по очереди
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Задержка между появлением дочерних элементов
    },
  },
};

// Варианты анимации для каждого отдельного элемента (заголовок, текст, кнопки)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
      {/* 1. ВИДЕОФОН */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <video
          autoPlay
          loop
          muted
          playsInline // Важно для автопроигрывания на iOS
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg" // Постер, который виден до загрузки видео
        >
          {/* Рекомендую использовать формат webm для лучшего сжатия */}
          <source src="/videos/hero-background.webm" type="video/webm" />
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        {/* 2. Затемняющий оверлей для читаемости текста */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 3. КОНТЕНТ С АНИМАЦИЕЙ */}
      <motion.div
        className="container mx-auto px-4 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
            className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-sm bg-border text-brand-accent rounded-full"
            variants={itemVariants}
        >
            <Sparkles size={16}/>
            <span>Премиум-сервис в Алматы</span>
        </motion.div>

        <motion.h1
          className="font-bold text-foreground text-shadow-strong"
          variants={itemVariants}
        >
          Ваш <span className="text-brand-accent">безупречный стиль</span><br/>начинается здесь
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-foreground/80"
          variants={itemVariants}
        >
          Откройте для себя эксклюзивный парк автомобилей и непревзойденный уровень сервиса. TopCar — это больше, чем просто аренда.
        </motion.p>

        {/* 4. КНОПКИ С ПРИЗЫВОМ К ДЕЙСТВИЮ */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          variants={itemVariants}
        >
          <Link
            href="/autopark"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-brand-accent text-background font-bold rounded-lg hover:bg-brand-accent-hover transition-transform hover:scale-105"
          >
            <span>Исследовать Автопарк</span>
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-4 bg-border/50 text-foreground font-medium rounded-lg hover:bg-border transition-colors"
          >
            Наши Услуги
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
