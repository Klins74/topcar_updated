// src/components/ServicesSection.tsx
'use client'

import { motion } from 'framer-motion';
import Link from 'next/link'; // Импортируем Link
import {
  UserGroupIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const services = [
    {
        slug: 'arenda-s-voditelem', // Slug для URL
        icon: UserGroupIcon,
        title: 'Аренда с водителем',
        description: 'Профессиональные водители со знанием города для вашего максимального удобства.'
    },
    {
        slug: 'transfer-v-aeroport', // Slug для URL
        icon: GlobeAltIcon,
        title: 'Трансфер в/из аэропорта',
        description: 'Встретим вас или ваших гостей с табличкой и комфортом доставим в любую точку города.'
    },
    {
        slug: 'arenda-na-meropriyatiya', // Slug для URL
        icon: CalendarDaysIcon,
        title: 'Аренда на мероприятия',
        description: 'Гибкие тарифы для деловых поездок, свадеб, фотосессий или личного пользования.'
    },
    {
        slug: 'security', // Slug для URL (ссылка на страницу безопасности)
        icon: ShieldCheckIcon,
        title: 'Безопасность и документы',
        description: 'Мы работаем полностью официально. Ознакомьтесь с нашими лицензиями и сертификатами.'
    }
];

const ServicesSection = () => {
    return (
        <section className="py-24 bg-neutral-950">
            <div className="container mx-auto px-4">
                {/* Заголовок убран, так как он теперь на основной странице */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          {/* Оборачиваем карточку в Link */}
                          <Link href={`/${service.slug}`} className="block h-full">
                            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 hover:border-[#d4af37] transition-colors duration-300 shadow-lg h-full flex flex-col">
                                <service.icon className="h-10 w-10 text-[#d4af37] mb-6 flex-shrink-0" />
                                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mt-auto">{service.description}</p>
                            </div>
                          </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;