// src/data/prices.ts

// Определяем, как будет выглядеть объект с одной ценой
export type Price = {
  car_id: number;
  with_driver: boolean;
  duration: number; // Длительность в часах (3, 6, 12, 24)
  price: number;
  conditions?: string;
};

// Создаем массив со всеми ценами из вашей таблицы
export const allPrices: Price[] = [
  // --- ЦЕНЫ БЕЗ ВОДИТЕЛЯ ---

  // Mercedes-Benz G63 800 (ID: 1)
  { car_id: 1, duration: 6, price: 152000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 1, duration: 12, price: 266000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 1, duration: 24, price: 380000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Mercedes-Benz W223 S580 (ID: 2)
  { car_id: 2, duration: 6, price: 152000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 2, duration: 12, price: 266000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 2, duration: 24, price: 380000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Lexus LX 570 2017 (ID: 3)
  { car_id: 3, duration: 6, price: 60000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 3, duration: 12, price: 105000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 3, duration: 24, price: 150000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },
  
  // Toyota LC200 (ID: 4)
  { car_id: 4, duration: 6, price: 60000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 4, duration: 12, price: 105000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 4, duration: 24, price: 150000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // BMW 428i Cabrio (ID: 5)
  { car_id: 5, duration: 6, price: 40000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 5, duration: 12, price: 70000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 5, duration: 24, price: 100000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Dodge Charger SRT 5,7 (ID: 6)
  { car_id: 6, duration: 6, price: 40000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 6, duration: 12, price: 70000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 6, duration: 24, price: 100000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },
  
  // Ford Mustang (ID: 7)
  { car_id: 7, duration: 6, price: 40000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 7, duration: 12, price: 70000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 7, duration: 24, price: 100000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },
  
  // Zeekr 007 (ID: 8)
  { car_id: 8, duration: 6, price: 40000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 8, duration: 12, price: 70000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 8, duration: 24, price: 100000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Zeekr 001 (ID: 9)
  { car_id: 9, duration: 6, price: 40000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 9, duration: 12, price: 70000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 9, duration: 24, price: 100000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Mercedes-Benz E-class (ID: 10)
  { car_id: 10, duration: 6, price: 32000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 10, duration: 12, price: 56000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 10, duration: 24, price: 80000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Rolls Royce ghost (ID: 13)
  { car_id: 13, duration: 6, price: 160000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 13, duration: 12, price: 280000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 13, duration: 24, price: 400000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // BMW X5 (ID: 14)
  { car_id: 14, duration: 6, price: 80000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 14, duration: 12, price: 140000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 14, duration: 24, price: 200000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },

  // Mercedes w222 (ID: 15)
  { car_id: 15, duration: 6, price: 40000, with_driver: false, conditions: '40%. 100км пробег' },
  { car_id: 15, duration: 12, price: 70000, with_driver: false, conditions: '70%. 150км пробег' },
  { car_id: 15, duration: 24, price: 100000, with_driver: false, conditions: '200км пробег. Бесплатно: Бензин, Мойка, доставка' },


  // --- ЦЕНЫ С ВОДИТЕЛЕМ ---

  // Mercedes-Benz G63 800 (ID: 1)
  { car_id: 1, duration: 3, price: 120000, with_driver: true },
  { car_id: 1, duration: 6, price: 200000, with_driver: true },
  { car_id: 1, duration: 12, price: 350000, with_driver: true },

  // Mercedes-Benz W223 S580 (ID: 2)
  { car_id: 2, duration: 3, price: 120000, with_driver: true },
  { car_id: 2, duration: 6, price: 200000, with_driver: true },
  { car_id: 2, duration: 12, price: 350000, with_driver: true },

  // Lexus LX 570 2017 (ID: 3)
  { car_id: 3, duration: 3, price: 70000, with_driver: true },
  { car_id: 3, duration: 6, price: 105000, with_driver: true },
  { car_id: 3, duration: 12, price: 150000, with_driver: true },

  // Toyota LC200 (ID: 4)
  { car_id: 4, duration: 3, price: 70000, with_driver: true },
  { car_id: 4, duration: 6, price: 105000, with_driver: true },
  { car_id: 4, duration: 12, price: 150000, with_driver: true },

  // BMW 428i Cabrio (ID: 5)
  { car_id: 5, duration: 3, price: 50000, with_driver: true },
  { car_id: 5, duration: 6, price: 70000, with_driver: true },
  { car_id: 5, duration: 12, price: 100000, with_driver: true },

  // Dodge Charger SRT 5,7 (ID: 6)
  { car_id: 6, duration: 3, price: 50000, with_driver: true },
  { car_id: 6, duration: 6, price: 70000, with_driver: true },
  { car_id: 6, duration: 12, price: 100000, with_driver: true },

  // Ford Mustang (ID: 7)
  { car_id: 7, duration: 3, price: 50000, with_driver: true },
  { car_id: 7, duration: 6, price: 70000, with_driver: true },
  { car_id: 7, duration: 12, price: 100000, with_driver: true },

  // Zeekr 007 (ID: 8)
  { car_id: 8, duration: 3, price: 50000, with_driver: true },
  { car_id: 8, duration: 6, price: 70000, with_driver: true },
  { car_id: 8, duration: 12, price: 100000, with_driver: true },

  // Zeekr 001 (ID: 9)
  { car_id: 9, duration: 3, price: 50000, with_driver: true },
  { car_id: 9, duration: 6, price: 70000, with_driver: true },
  { car_id: 9, duration: 12, price: 100000, with_driver: true },
  
  // Mercedes-Benz E-class (ID: 10)
  { car_id: 10, duration: 3, price: 32000, with_driver: true },
  { car_id: 10, duration: 6, price: 60000, with_driver: true },
  { car_id: 10, duration: 12, price: 80000, with_driver: true },
  
  // Rolls Royce phantom (ID: 11)
  { car_id: 11, duration: 3, price: 180000, with_driver: true },
  { car_id: 11, duration: 6, price: 300000, with_driver: true },
  { car_id: 11, duration: 12, price: 450000, with_driver: true },
  
  // Rolls Royce Ghost (ID: 13)
  { car_id: 13, duration: 3, price: 180000, with_driver: true },
  { car_id: 13, duration: 6, price: 300000, with_driver: true },
  { car_id: 13, duration: 12, price: 400000, with_driver: true },
  
  // Bentley (ID: 12)
  { car_id: 12, duration: 3, price: 80000, with_driver: true },
  { car_id: 12, duration: 6, price: 120000, with_driver: true },
  { car_id: 12, duration: 12, price: 240000, with_driver: true },
  
  // BMW X5 (ID: 14)
  { car_id: 14, duration: 3, price: 70000, with_driver: true },
  { car_id: 14, duration: 6, price: 100000, with_driver: true },
  { car_id: 14, duration: 12, price: 180000, with_driver: true },
];