'use client';

import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  PhoneIcon,
  CalendarDaysIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'; // ИЗМЕНЕНИЕ ЗДЕСЬ

const services = [
    {
        icon: MapPinIcon,
        title: 'Трансферы в/из аэропорта',
        description: 'Встретим вас или ваших гостей с табличкой и комфортом доставим в любую точку города.'
    },
    {
        icon: CalendarDaysIcon,
        title: 'Почасовая и посуточная аренда',
        description: 'Гибкие тарифы для деловых поездок, мероприятий или личного пользования.'
    },
    {
        icon: CheckCircleIcon,
        title: 'Аренда с личным водителем',
        description: 'Профессиональные водители со знанием города для вашего максимального удобства.'
    },
    {
        icon: PhoneIcon,
        title: 'Поддержка 24/7',
        description: 'Наша команда всегда на связи, чтобы помочь вам в любой ситуации на дороге.'
    }
];

const ServicesSection = () => {
    return (
        <section className="py-24 bg-neutral-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-white">
                        Наши <span className="text-[#d4af37]">Услуги</span>
                    </h2>
                    <p className="text-center text-neutral-400 max-w-2xl mx-auto mb-16">
                        Мы предлагаем полный спектр услуг по аренде автомобилей премиум-класса, чтобы удовлетворить любые ваши потребности.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 hover:border-[#d4af37] transition-colors duration-300 shadow-lg"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <service.icon className="h-10 w-10 text-[#d4af37] mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;