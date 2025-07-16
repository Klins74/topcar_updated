// src/lib/fleet.ts
import { Car } from '@/types'; // Импортируем Car из центрального файла типов

/* Полный список из 14 автомобилей — убедитесь, что имена файлов и цены актуальны */
export const fleet: Car[] = [
  { id: 1,  name: 'Mercedes‑benz G63 800',       brand: 'Mercedes‑benz', class: 'Luxury',    pricing: { withoutDriver: { '24h': 152000 } }, image: '/cars/g63.jpg' },
  { id: 2,  name: 'Mercedes‑benz W223 S580',      brand: 'Mercedes‑benz', class: 'Luxury',    pricing: { withoutDriver: { '24h': 152000 } }, image: '/cars/w223s580.jpg' },
  { id: 3,  name: 'Lexus LX 570 2017',            brand: 'Lexus',        class: 'Premium', pricing: { withoutDriver: { '24h': 60000 } },  image: '/cars/lx570.jpg' },
  { id: 4,  name: 'Toyota LC200',                 brand: 'Toyota',       class: 'Premium', pricing: { withoutDriver: { '24h': 60000 } },  image: '/cars/lc200.jpg' },
  { id: 5,  name: 'BMW 428i Cabrio',              brand: 'BMW',          class: 'Business',  pricing: { withoutDriver: { '24h': 40000 } },  image: '/cars/428icabrio.jpg' },
  { id: 6,  name: 'Dodge Charger SRT 5,7',        brand: 'Dodge',        class: 'Business',  pricing: { withoutDriver: { '24h': 40000 } },  image: '/cars/charger.jpg' },
  { id: 7,  name: 'Ford Mustang',                 brand: 'Ford',         class: 'Business',  pricing: { withoutDriver: { '24h': 40000 } },  image: '/cars/mustang.jpg' },
  { id: 8,  name: 'Zeekr 007',                    brand: 'Zeekr',        class: 'Premium', pricing: { withoutDriver: { '24h': 50000 } },  image: '/cars/zeekr007.jpg' },
  { id: 9,  name: 'Zeekr 001 (белый)',            brand: 'Zeekr',        class: 'Premium', pricing: { withoutDriver: { '24h': 50000 } },  image: '/cars/zeekr001w.jpg' },
  { id: 10, name: 'Zeekr 001',              brand: 'Zeekr',    class: 'Premium', pricing: { withoutDriver: { '24h': 50000 } },  image: '/cars/zeekr001.jpg' },
  { id: 11, name: 'Mercedes‑benz E‑class',        brand: 'Mercedes‑benz', class: 'Business',  pricing: { withoutDriver: { '24h': 40000 } },  image: '/cars/eclass.jpg' },
  { id: 12, name: 'Kia Sorento',                  brand: 'Kia',          class: 'Economy',  pricing: { withoutDriver: { '24h': 35000 } },  image: '/cars/sorento.jpg' },
  { id: 13, name: 'Rolls Royce Ghost',            brand: 'Rolls Royce',  class: 'Luxury',    pricing: { withoutDriver: { '24h': 180000 } }, image: '/cars/ghost.jpg' },
  { id: 14, name: 'BMW X5',                       brand: 'BMW',          class: 'Premium', pricing: { withoutDriver: { '24h': 100000 } }, image: '/cars/x5.jpg' },
]

export default fleet