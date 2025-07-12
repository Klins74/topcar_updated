// src/components/ServicesSection.tsx
'use client'

import Link from 'next/link'; // <--- Импортируем Link
import FadeInWhenVisible from './FadeInWhenVisible';
import {
  CalendarDaysIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

// Обновим наш тип Service, чтобы включить slug
type Service = {
  slug: string; // <-- Добавили slug
  title: string;
  desc: string;
  Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>
}

export default function ServicesSection() {
  const services: Service[] = [
    { slug: 'long-term-rental', title: 'Долгосрочная аренда', desc: 'Экономия при аренде на 1+ месяц.', Icon: CalendarDaysIcon },
    { slug: 'airport-transfer', title: 'Трансфер', desc: 'Премиум трансфер до/из аэропорта.', Icon: PaperAirplaneIcon },
    // Добавьте другие услуги по аналогии
  ];

  return (
    <section id="services" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <FadeInWhenVisible>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-16 sm:mb-20 text-center tracking-tight text-white">
            Услуги и <span className="text-[#d4af37]">привилегии</span>
            <span className="block w-24 h-1 bg-[#d4af37] mx-auto mt-4"></span>
          </h2>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          {services.map(({ slug, title, desc, Icon }, idx) => (
            <FadeInWhenVisible key={idx} delay={idx * 0.1}>
              <Link href={`/services/${slug}`} className="block group"> {/* Оборачиваем карточку в Link */}
                <div 
                  className="h-full bg-gradient-to-br from-neutral-900 to-neutral-800 
                             border border-neutral-700 rounded-2xl p-6 sm:p-8 
                             shadow-2xl transition-all duration-300 ease-in-out
                             group-hover:shadow-[#d4af37]/30 group-hover:border-[#d4af37]/50 group-hover:-translate-y-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-[#d4af37] transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">{title}</h3>
                      <p className="text-sm sm:text-base text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  )
}