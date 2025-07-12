export type Car = {
  id: number
  name: string
  brand: string
  class: 'Эконом' | 'Бизнес' | 'Премиум' | 'Люкс'
  price24: number
  image: string       // public/cars/…
  desc: string
}

/* full 14‑car list – keep filenames & prices up‑to‑date here */
export const fleet: Car[] = [
  { id: 1,  name: 'Mercedes‑Benz G63 800',  brand: 'Mercedes', class: 'Люкс',     price24: 380_000, image: 'g63.jpg',        desc: 'Абсолютная роскошь, мощь и комфорт.' },
  { id: 2,  name: 'Mercedes‑Benz W223 S580',brand: 'Mercedes', class: 'Люкс',     price24: 380_000, image: 'w223.jpg',       desc: 'Флагманский седан для больших поездок.' },
  { id: 3,  name: 'Lexus LX 570 2017',      brand: 'Lexus',    class: 'Люкс',     price24: 150_000, image: 'lx570.jpg',      desc: 'Легендарный внедорожник — стиль и сила.' },
  { id: 4,  name: 'Toyota LC200',           brand: 'Toyota',   class: 'Люкс',     price24: 150_000, image: 'lc200.jpg',      desc: 'Надёжность и комфорт бизнес‑класса.' },
  { id: 5,  name: 'BMW 428i Cabrio',        brand: 'BMW',      class: 'Бизнес',   price24: 100_000, image: 'bmw428.jpg',     desc: 'Кабриолет для ярких городских поездок.' },
  { id: 6,  name: 'Dodge Charger SRT 5.7',  brand: 'Dodge',    class: 'Бизнес',   price24: 100_000, image: 'dodgesrt.jpg',   desc: 'Американская мощь и характер.' },
  { id: 7,  name: 'Ford Mustang',           brand: 'Ford',     class: 'Бизнес',   price24: 100_000, image: 'mustang.jpg',    desc: 'Легендарный масл‑кар.' },
  { id: 8,  name: 'Zeekr 007',              brand: 'Zeekr',    class: 'Премиум',  price24: 100_000, image: 'z007.jpg',   desc: 'Электрический премиум будущего.' },
  { id: 9,  name: 'Zeekr 001 (белый)',      brand: 'Zeekr',    class: 'Премиум',  price24: 100_000, image: 'z001w.jpg',  desc: 'Белый Zeekr 001 — чистая элегантность.' },
  { id: 10, name: 'Zeekr 001',              brand: 'Zeekr',    class: 'Премиум',  price24: 100_000, image: 'z001.jpg',   desc: 'Флагманский электрокроссовер Zeekr.' },
  { id: 11, name: 'Mercedes‑Benz E‑class',  brand: 'Mercedes', class: 'Бизнес',   price24:  80_000, image: 'eclass.jpg',     desc: 'Эталон комфорта бизнес‑класса.' },
  { id: 12, name: 'Kia Sorento',            brand: 'Kia',      class: 'Эконом',   price24:  70_000, image: 'sorento.jpg',    desc: 'Практичный выбор для семьи или команды.' },
  { id: 13, name: 'Rolls‑Royce Ghost',      brand: 'Rolls‑Royce', class: 'Люкс',  price24: 400_000, image: 'ghost.jpg',      desc: 'Безупречная роскошь и тишина.' },
  { id: 14, name: 'BMW X5',                 brand: 'BMW',      class: 'Премиум',  price24: 200_000, image: 'x5.jpg',         desc: 'Универсальный премиум‑кроссовер.' },
]
