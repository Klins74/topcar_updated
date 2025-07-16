// src/lib/fleet.ts
import { type Car } from '@/types'; // Импортируем наш правильный тип

const fleet: Car[] = [
  // "Люкс" заменено на "Luxury"
  { 
    id: 1,  
    name: 'Mercedes-benz G63 800',     
    brand: 'Mercedes-benz', 
    class: 'Luxury',  
    image: '/cars/g63.jpg',
    description: 'Абсолютная роскошь, мощь и комфорт.',
    pricing: { withoutDriver: { '24h': 152000 } } 
  },
  { 
    id: 2,  
    name: 'Mercedes-benz W223 S580',     
    brand: 'Mercedes-benz', 
    class: 'Luxury',  
    image: '/cars/w223s580.jpg',
    description: 'Флагманский седан для больших поездок.',
    pricing: { withoutDriver: { '24h': 152000 } } 
  },
  { 
    id: 13, 
    name: 'Rolls Royce Ghost',          
    brand: 'Rolls Royce',   
    class: 'Luxury',  
    image: '/cars/ghost.jpg',
    description: 'Икона статуса и непревзойденного комфорта.',
    pricing: { withoutDriver: { '24h': 180000 } } 
  },
  
  // "Премиум" заменено на "Premium"
  { 
    id: 3,  
    name: 'Lexus LX 570 2017',        
    brand: 'Lexus',         
    class: 'Premium', 
    image: '/cars/lx570.jpg',
    description: 'Легендарный внедорожник — стиль и сила.',
    pricing: { withoutDriver: { '24h': 60000 } } 
  },
  { 
    id: 4,  
    name: 'Toyota LC200',             
    brand: 'Toyota',        
    class: 'Premium', 
    image: '/cars/lc200.jpg',
    description: 'Надёжность и комфорт бизнес‑класса.',
    pricing: { withoutDriver: { '24h': 60000 } } 
  },
  { 
    id: 8,  
    name: 'Zeekr 007',                
    brand: 'Zeekr',         
    class: 'Premium', 
    image: '/cars/zeekr007.jpg',
    description: 'Электрический седан нового поколения.',
    pricing: { withoutDriver: { '24h': 50000 } } 
  },
  { 
    id: 9,  
    name: 'Zeekr 001 (белый)',        
    brand: 'Zeekr',         
    class: 'Premium', 
    image: '/cars/zeekr001w.jpg',
    description: 'Динамичный и технологичный электромобиль.',
    pricing: { withoutDriver: { '24h': 50000 } } 
  },
  { 
    id: 10, 
    name: 'Zeekr 001',                
    brand: 'Zeekr',         
    class: 'Premium', 
    image: '/cars/zeekr001.jpg',
    description: 'Стильный и мощный электрический лифтбэк.',
    pricing: { withoutDriver: { '24h': 50000 } } 
  },
  { 
    id: 14, 
    name: 'BMW X5',                   
    brand: 'BMW',           
    class: 'Premium', 
    image: '/cars/x5.jpg',
    description: 'Сочетание динамики, комфорта и технологий.',
    pricing: { withoutDriver: { '24h': 100000 } } 
  },
  
  // "Бизнес" заменено на "Business"
  { 
    id: 5,  
    name: 'BMW 428i Cabrio',          
    brand: 'BMW',           
    class: 'Business',
    image: '/cars/428icabrio.jpg',
    description: 'Кабриолет для ярких впечатлений.',
    pricing: { withoutDriver: { '24h': 40000 } } 
  },
  { 
    id: 6,  
    name: 'Dodge Charger SRT 5,7',      
    brand: 'Dodge',         
    class: 'Business',
    image: '/cars/charger.jpg',
    description: 'Американская мощь и харизма.',
    pricing: { withoutDriver: { '24h': 40000 } } 
  },
  { 
    id: 7,  
    name: 'Ford Mustang',             
    brand: 'Ford',          
    class: 'Business',
    image: '/cars/mustang.jpg',
    description: 'Легендарный маслкар для ценителей скорости.',
    pricing: { withoutDriver: { '24h': 40000 } } 
  },
  { 
    id: 11, 
    name: 'Mercedes-benz E-class',      
    brand: 'Mercedes-benz', 
    class: 'Business',
    image: '/cars/eclass.jpg',
    description: 'Эталон бизнес-класса, комфорт и престиж.',
    pricing: { withoutDriver: { '24h': 40000 } } 
  },
  
  // Этот автомобиль не был в вашем списке, но если он нужен, 
  // то он должен быть "Economy"
  // { 
  //   id: 12, 
  //   name: 'Kia Sorento',              
  //   brand: 'Kia',           
  //   class: 'Economy', 
  //   image: '/cars/sorento.jpg',
  //   pricing: { withoutDriver: { '24h': 35000 } } 
  // },
];

export default fleet;