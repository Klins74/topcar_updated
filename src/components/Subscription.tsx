// src/components/Subscription.tsx
'use client'

import Link from 'next/link' // Import Link
import FadeInWhenVisible from './FadeInWhenVisible'
import { CheckBadgeIcon, CurrencyEuroIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

type Benefit = {
  name: string;
  description?: string;
  Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>;
};

export default function Subscription() {
  const benefits: Benefit[] = [
    { name: 'Эксклюзивные тарифы', description: 'Особые цены, доступные только для членов клуба.', Icon: CurrencyEuroIcon },
    { name: 'Приоритетное бронирование', description: 'Первоочередной доступ к новинкам и популярным моделям автопарка.', Icon: SparklesIcon },
    { name: 'Персональный консьерж', description: 'Выделенная линия поддержки и помощь в подборе автомобиля.', Icon: CheckBadgeIcon },
  ];

  return (
    <section id="subscription" className="py-24 sm:py-32 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeInWhenVisible>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center tracking-tight">
            Станьте частью <span className="text-[#d4af37]">TopCar Elite</span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-400 mb-16 sm:mb-20 text-center max-w-2xl mx-auto">
            Откройте для себя мир непревзойденной роскоши и эксклюзивных преимуществ с нашей клубной подпиской.
          </p>
        </FadeInWhenVisible>

        <div 
          className="bg-gradient-to-br from-neutral-900 to-black border border-[#d4af37]/30 rounded-2xl shadow-2xl 
                     p-8 sm:p-12 md:p-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-12 sm:mb-16">
            {benefits.map((benefit, idx) => (
              <FadeInWhenVisible key={idx} delay={idx * 0.1}>
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div 
                    className="flex-shrink-0 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full p-3 mb-4
                               group-hover:bg-[#d4af37]/20 transition-colors duration-300"
                  >
                    <benefit.Icon className="h-8 w-8 text-[#d4af37]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{benefit.name}</h3>
                  {benefit.description && (
                    <p className="text-sm text-neutral-400 leading-relaxed">{benefit.description}</p>
                  )}
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          <FadeInWhenVisible delay={benefits.length * 0.1}>
            <div className="text-center">
              {/* CHANGED: Button is now a Link component */}
              <Link
                href="/contacts" // Or your dedicated subscription page e.g., /join-club
                className="group relative inline-flex items-center justify-center px-10 py-4 sm:px-12 sm:py-5 
                           bg-[#d4af37] text-black rounded-lg text-base sm:text-lg font-bold
                           hover:bg-[#c0982c] transition-all duration-300 ease-in-out
                           focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 shadow-lg hover:shadow-xl
                           transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Присоединиться к клубу</span>
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-xs text-neutral-500">
                Нажимая &quot;Присоединиться&quot;, вы соглашаетесь с условиями клубной программы.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  )
}

