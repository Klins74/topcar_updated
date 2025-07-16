import { Car } from '@/types'; // Импортируем главный тип Car

//
// ЭТО ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ ФАЙЛА.
// В ней используются правильные английские названия для 'class'
// и правильные названия полей 'price_per_day' и 'image_url'.
//
export const fleet: Car[] = [
  { id: 1,  name: 'Mercedes-Benz G63 800',  brand: 'Mercedes', class: 'Luxury',   price_per_day: 380000, image_url: '/cars/g63.jpg',    description: 'Абсолютная роскошь, мощь и комфорт.' },
  { id: 2,  name: 'Mercedes-Benz W223 S580',brand: 'Mercedes', class: 'Luxury',   price_per_day: 380000, image_url: '/cars/w223.jpg',    description: 'Флагманский седан для больших поездок.' },
  { id: 3,  name: 'Lexus LX 570 2017',      brand: 'Lexus',    class: 'Luxury',   price_per_day: 150000, image_url: '/cars/lx570.jpg',    description: 'Легендарный внедорожник — стиль и сила.' },
  { id: 4,  name: 'Toyota LC200',           brand: 'Toyota',   class: 'Luxury',   price_per_day: 150000, image_url: '/cars/lc200.jpg',    description: 'Надёжность и комфорт бизнес-класса.' },
  { id: 5,  name: 'BMW 428i Cabrio',        brand: 'BMW',      class: 'Business', price_per_day: 100000, image_url: '/cars/bmw428.jpg',    description: 'Кабриолет для ярких городских поездок.' },
  { id: 6,  name: 'Hyundai Staria',         brand: 'Hyundai',  class: 'Business', price_per_day: 100000, image_url: '/cars/staria.jpg',    description: 'Современный и вместительный минивэн.' },
  { id: 7,  name: 'Mercedes-Benz V-class',  brand: 'Mercedes', class: 'Business', price_per_day: 100000, image_url: '/cars/vclass.jpg',    description: 'VIP-минивэн для деловых встреч.' },
  { id: 8,  name: 'Toyota Camry 70',        brand: 'Toyota',   class: 'Business', price_per_day: 80000,  image_url: '/cars/camry70.jpg',   description: 'Классический седан для комфортных поездок.' },
  { id: 9,  name: 'Kia K5',                 brand: 'Kia',      class: 'Business', price_per_day: 80000,  image_url: '/cars/k5.jpg',        description: 'Стильный седан с богатым оснащением.' },
  { id: 10, name: 'Hyundai Elantra',        brand: 'Hyundai',  class: 'Economy',  price_per_day: 70000,  image_url: '/cars/elantra.jpg',   description: 'Экономичный и надёжный выбор на каждый день.' },
  { id: 11, name: 'Mercedes-Benz E-class',  brand: 'Mercedes', class: 'Business', price_per_day: 80000,  image_url: '/cars/eclass.jpg',    description: 'Эталон комфорта бизнес-класса.' },
  { id: 12, name: 'Kia Sorento',            brand: 'Kia',      class: 'Economy',  price_per_day: 70000,  image_url: '/cars/sorento.jpg',   description: 'Практичный выбор для семьи или команды.' },
  { id: 13, name: 'Rolls-Royce Ghost',      brand: 'Rolls-Royce', class: 'Luxury', price_per_day: 400000, image_url: '/cars/ghost.jpg',   description: 'Безупречная роскошь и тишина.' },
  { id: 14, name: 'BMW X5',                 brand: 'BMW',      class: 'Premium',  price_per_day: 200000, image_url: '/cars/x5.jpg',        description: 'Универсальный премиум-кроссовер.' }
];