// src/lib/fleet.ts
import { Car } from '@/types';

//
// ВАЖНО: Убедитесь, что ID здесь соответствуют ID в вашей таблице `prices`
//
export const fleet: Car[] = [
  { id: 1,  name: 'Mercedes-Benz G63 800',   slug: 'mercedes-benz-g63-800',   brand: 'Mercedes', class: 'Luxury',   price_per_day: 380000, image_url: '/cars/g63.jpg',    description: 'Абсолютная роскошь, мощь и комфорт.' },
  { id: 2,  name: 'Mercedes-Benz W223 S580', slug: 'mercedes-benz-w223-s580', brand: 'Mercedes', class: 'Luxury',   price_per_day: 380000, image_url: '/cars/w223.jpg',    description: 'Флагманский седан для больших поездок.' },
  { id: 3,  name: 'Lexus LX 570 2017',       slug: 'lexus-lx570-2017',       brand: 'Lexus',    class: 'Luxury',   price_per_day: 150000, image_url: '/cars/lx570.jpg',    description: 'Легендарный внедорожник — стиль и сила.' },
  { id: 4,  name: 'Toyota LC200',            slug: 'toyota-lc200',            brand: 'Toyota',   class: 'Luxury',   price_per_day: 150000, image_url: '/cars/lc200.jpg',    description: 'Надёжность и комфорт бизнес-класса.' },
  { id: 5,  name: 'BMW 428i Cabrio',         slug: 'bmw-428i-cabrio',         brand: 'BMW',      class: 'Premium',  price_per_day: 100000, image_url: '/cars/bmw428.jpg',   description: 'Свобода и скорость в элегантном кабриолете.' },
  { id: 11, name: 'Mercedes-Benz E-class',   slug: 'mercedes-benz-e-class',   brand: 'Mercedes', class: 'Business', price_per_day: 80000,  image_url: '/cars/e-class.jpg', description: 'Идеальный баланс комфорта и технологий.' },
  { id: 13, name: 'Rolls Royce Ghost',       slug: 'rolls-royce-ghost',       brand: 'Rolls Royce', class: 'Luxury', price_per_day: 400000, image_url: '/cars/ghost.jpg', description: 'Непревзойденная роскошь и умиротворение.' },
  { id: 14, name: 'BMW X5',                  slug: 'bmw-x5',                  brand: 'BMW',      class: 'Premium',  price_per_day: 200000, image_url: '/cars/x5.jpg',     description: 'Сочетание динамики и универсальности.' },
  { id: 15, name: 'Zeekr001',                slug: 'zeekr-001',               brand: 'Zeekr',    class: 'Premium',  price_per_day: 100000, image_url: '/cars/zeekr001.jpg', description: 'Электрический спорткар будущего.' },
  { id: 16, name: 'Zeekr007',                slug: 'zeekr-007',               brand: 'Zeekr',    class: 'Premium',  price_per_day: 100000, image_url: '/cars/zeekr007.jpg', description: 'Инновации и дизайн в каждой детали.' },
];