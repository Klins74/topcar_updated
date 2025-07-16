// src/types/index.ts

// Тип для автомобиля
export type Car = {
  id: number;
  name: string;
  brand: string;
  class: 'Economy' | 'Business' | 'Premium' | 'Luxury';
  image: string; // Основное изображение для карточки
  description?: string;
  pricing: {
    withoutDriver?: { [key: string]: number };
    withDriver?: { [key: string]: number };
    transfer?: number;
  };

  // --- ДОБАВЛЕННЫЕ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ---
  galleryImages?: string[];
  image_url: string; // Изображение для модального окна
  power: number;
  acceleration: number;
  fuel_type: string;
  drive_type: string;
  seats: number;
  year: number;
  price_per_day: number;
};

// Тип для пользователя
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Тип для бронирования
export interface Booking {
  id: string;
  car_name: string;
  user_name?: string;
  user_phone: string;
  date_from: string;
  date_to: string;
  created_at: string;
  status?: 'confirmed' | 'active' | 'completed' | 'cancelled';
  total_price?: number;
  car_image_url?: string;
}

// Тип для промокода
export interface PromoCode {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expiry_date: string;
  usage_limit: number | null;
  usage_count: number;
}