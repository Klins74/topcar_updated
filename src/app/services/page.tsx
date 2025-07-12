// src/app/services/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'
import FadeInWhenVisible from '@/components/FadeInWhenVisible'
import LoginModal from '@/components/LoginModal'
import {
  CalendarDaysIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  TagIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

type Service = {
  icon?: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>;
  iconPath?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
};

const servicesData: Service[] = [
  {
    icon: CalendarDaysIcon,
    title: 'Долгосрочная аренда',
    description:
      'Эксклюзивные условия и экономия до 40% при аренде от 30 дней. Идеально для бизнес-проектов и продолжительных визитов в Алматы, обеспечивая вас мобильностью премиум-класса без лишних забот.',
    ctaText: 'Узнать больше',
    ctaLink: '#contact',
  },
  {
    icon: UserGroupIcon,
    title: 'Аренда с водителем',
    description:
      'Наши профессиональные водители обеспечат вам максимальный комфорт, безопасность и конфиденциальность. Сосредоточьтесь на важном, пока мы заботимся о вашем передвижении.',
    ctaText: 'Заказать услугу',
    ctaLink: '#contact',
  },
  {
    icon: PaperAirplaneIcon,
    title: 'Аэропорт трансфер',
    description:
      'Безупречная встреча в аэропорту Алматы и комфортабельный трансфер до вашего отеля или любого другого пункта назначения на автомобиле представительского класса.',
    ctaText: 'Оформить трансфер',
    ctaLink: '#contact',
  },
  {
    icon: SparklesIcon,
    title: 'VIP-обслуживание',
    description:
      'Персональный менеджер 24/7, приоритетное бронирование эксклюзивных моделей, специальные запросы и полная конфиденциальность для самых требовательных клиентов.',
    ctaText: 'Стать VIP-клиентом',
    ctaLink: '#contact',
  },
  {
    icon: TagIcon,
    title: 'Программа лояльности',
    description:
      'Ценим наших постоянных клиентов. Накапливайте бонусы, получайте персональные скидки до 20% и эксклюзивные предложения на будущие аренды.',
    ctaText: 'Подробнее о бонусах',
    ctaLink: '/subscription',
  },
];

export default function ServicesPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <AnimatedPageWrapper>
      <Header onLoginClick={() => setShowLoginModal(true)} />
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <main className="min-h-screen bg-neutral-950 text-white font-sans">
        {/* Hero/Intro Section */}
        <section className="relative py-24 sm:py-32 md:py-40 text-center bg-gradient-to-b from-black via-neutral-900 to-neutral-950 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/geometric-luxury.svg')] bg-repeat"></div> {/* Ensure this SVG exists or remove/comment out */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <FadeInWhenVisible>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                Эксклюзивный <span className="text-[#d4af37]">Сервис TopCar</span>
              </h1>
              <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                Мы предлагаем не просто автомобили, а комплексные решения для вашего комфорта и статуса. Откройте для себя мир привилегий с TopCar.
              </p>
              <span className="block w-20 h-1 bg-[#d4af37]/50 mx-auto mt-8"></span>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Services Grid Section */}
        <section id="our-services" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {servicesData.map((service, idx) => (
                <FadeInWhenVisible key={idx} delay={idx * 0.05} className="flex">
                  <div 
                    className="group flex flex-col bg-gradient-to-br from-neutral-900 to-black 
                               border border-neutral-700/80 rounded-2xl shadow-2xl 
                               p-6 sm:p-8 transition-all duration-300 ease-in-out 
                               hover:shadow-[#d4af37]/20 hover:border-[#d4af37]/50 hover:-translate-y-1.5 flex-grow"
                  >
                    <div className="flex-shrink-0 mb-6">
                      {service.icon && (
                        <div className="inline-flex items-center justify-center 
                                      w-16 h-16 bg-[#d4af37]/10 border-2 border-[#d4af37]/30 rounded-full
                                      group-hover:bg-[#d4af37]/20 group-hover:border-[#d4af37]/60 transition-all duration-300">
                          <service.icon 
                            className={`h-8 w-8 text-[#d4af37] ${service.title === 'Аэропорт трансфер' ? '-rotate-45' : ''}`} 
                          />
                        </div>
                      )}
                      {service.iconPath && (
                         <div className="inline-flex items-center justify-center 
                                      w-16 h-16 bg-[#d4af37]/10 border-2 border-[#d4af37]/30 rounded-full
                                      group-hover:bg-[#d4af37]/20 group-hover:border-[#d4af37]/60 transition-all duration-300">
                            <Image src={service.iconPath} alt={`${service.title} icon`} width={32} height={32} />
                         </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#d4af37] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-400 leading-relaxed flex-grow mb-6 group-hover:text-neutral-300 transition-colors duration-300">
                      {service.description}
                    </p>

                    {service.ctaText && service.ctaLink && (
                      <div className="mt-auto pt-4">
                        <Link
                          href={service.ctaLink}
                          className="inline-flex items-center text-sm font-medium text-[#d4af37] group-hover:text-white
                                     hover:underline underline-offset-4 decoration-1 decoration-[#d4af37]/50 group-hover:decoration-white transition-all duration-300"
                        >
                          {service.ctaText}
                          <ChevronRightIcon className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </AnimatedPageWrapper>
  )
}
