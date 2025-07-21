/**
 * =================================================================
 * ГЛАВНЫЕ ТИПЫ ДАННЫХ ВАШЕГО ПРИЛОЖЕНИЯ
 * =================================================================
 */

// Тип для цен из таблицы `prices`
export type Price = {
  id: number;
  car_id: number;
  days_from: number;
  days_to: number;
  price_per_day: number;
  with_driver: boolean;
  conditions?: string;
};

/**
 * Тип для автомобиля.
 */
export type Car = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  class: 'Economy' | 'Business' | 'Premium' | 'Luxury';
  description: string;
  full_description?: string;
  image_url: string;
  gallery_images?: string[];
  prices?: Price[]; // Массив цен из таблицы `prices`
  
  price_per_day: number; // Оставляем как запасной вариант

  // Необязательные технические характеристики
  power?: number;
  acceleration?: number;
  fuel_type?: string;
  drive_type?: string;
  seats?: number;
  year?: number;
};

// ...остальные типы без изменений
export type PromoCode = { /* ... */ };
export type User = { /* ... */ };
export type Booking = { /* ... */ };