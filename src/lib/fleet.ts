
// src/lib/fleet.ts
export type Car = {
  id: number
  name: string
  brand: string
  class: 'Эконом' | 'Бизнес' | 'Премиум' | 'Люкс'
  price: number    // daily base price
  image: string    // e.g. "/cars/g63.jpg"
  desc?: string
}

const fleet: Car[] = [
  { id: 1,  name: 'Mercedes‑benz G63 800',       brand: 'Mercedes‑benz', class: 'Люкс',    price: 152000, image: '/cars/g63.jpg' },
  { id: 2,  name: 'Mercedes‑benz W223 S580',      brand: 'Mercedes‑benz', class: 'Люкс',    price: 152000, image: '/cars/w223s580.jpg' },
  { id: 3,  name: 'Lexus LX 570 2017',            brand: 'Lexus',        class: 'Премиум', price: 60000,  image: '/cars/lx570.jpg' },
  { id: 4,  name: 'Toyota LC200',                 brand: 'Toyota',       class: 'Премиум', price: 60000,  image: '/cars/lc200.jpg' },
  { id: 5,  name: 'BMW 428i Cabrio',              brand: 'BMW',          class: 'Бизнес',  price: 40000,  image: '/cars/428icabrio.jpg' },
  { id: 6,  name: 'Dodge Charger SRT 5,7',        brand: 'Dodge',        class: 'Бизнес',  price: 40000,  image: '/cars/charger.jpg' },
  { id: 7,  name: 'Ford Mustang',                 brand: 'Ford',         class: 'Бизнес',  price: 40000,  image: '/cars/mustang.jpg' },
  { id: 8,  name: 'Zeekr 007',                    brand: 'Zeekr',        class: 'Премиум', price: 50000,  image: '/cars/zeekr007.jpg' },
  { id: 9,  name: 'Zeekr 001 (белый)',            brand: 'Zeekr',        class: 'Премиум', price: 50000,  image: '/cars/zeekr001w.jpg' },
  { id: 10, name: 'Zeekr 001',                    brand: 'Zeekr',        class: 'Премиум', price: 50000,  image: '/cars/zeekr001.jpg' },
  { id: 11, name: 'Mercedes‑benz E‑class',        brand: 'Mercedes‑benz', class: 'Бизнес',  price: 40000,  image: '/cars/eclass.jpg' },
  { id: 12, name: 'Kia Sorento',                  brand: 'Kia',          class: 'Эконом',  price: 35000,  image: '/cars/sorento.jpg' },
  { id: 13, name: 'Rolls Royce Ghost',            brand: 'Rolls Royce',  class: 'Люкс',    price: 180000, image: '/cars/ghost.jpg' },
  { id: 14, name: 'BMW X5',                       brand: 'BMW',          class: 'Премиум', price: 100000, image: '/cars/x5.jpg' },
]

export default fleet

