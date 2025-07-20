/**
 * =================================================================
 * ГЛАВНЫЕ ТИПЫ ДАННЫХ ВАШЕГО ПРИЛОЖЕНИЯ
 * =================================================================
 */

// --- НОВЫЙ ТИП для цен ---
export type Price = {
  id: number;
  car_id: number;
  days_from: number;
  days_to: number;
  price_per_day: number;
  with_driver: boolean;
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
  prices?: Price[]; // <-- ДОБАВЛЕНО: массив цен из новой таблицы
  
  // Старые поля цен, которые больше не нужны, но оставляем для совместимости
  price_per_day: number;
  price_with_driver?: number;

  // Необязательные технические характеристики
  power?: number;
  acceleration?: number;
  fuel_type?: string;
  drive_type?: string;
  seats?: number;
  year?: number;
  
  // Это поле больше не используется, можно будет позже удалить
  pricing?: any;
};

// ...остальные типы без изменений
export type PromoCode = {
  id: number;
  code: string;
  is_active: boolean;
  discount_perc: number;
  expires_at: string;
  times_used: number;
  usage_limit: number | null;
  is_personal: boolean;
  user_id: string | null;
  created_at: string;
};

export type User = {
    id: string;
    email?: string;
    full_name?: string;
    phone?: string;
};

export type Booking = {
    id: number;
    car_id: number;
    user_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
};