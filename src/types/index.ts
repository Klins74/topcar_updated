/**
 * =================================================================
 * ГЛАВНЫЕ ТИПЫ ДАННЫХ ВАШЕГО ПРИЛОЖЕНИЯ
 * =================================================================
 * Этот файл — единственный источник правды о структуре ваших данных.
 * Все названия полей здесь точно соответствуют названиям столбцов в Supabase.
 */

/**
 * Тип для автомобиля.
 * Источник: таблица 'cars' в Supabase.
 */
export type Car = {
  id: number;
  name: string;
  brand: string;
  class: 'Economy' | 'Business' | 'Premium' | 'Luxury';
  description: string;
  image_url: string;
  price_per_day: number;

  // Необязательные технические характеристики
  power?: number;
  acceleration?: number;
  fuel_type?: string;
  drive_type?: string;
  seats?: number;
  year?: number;

  // Необязательная структура для сложных тарифов
  pricing?: {
    withoutDriver?: {
      '24h'?: number;
    };
  };
};

/**
 * Тип для промокода.
 * Источник: таблица 'public_promocodes' в Supabase.
 * Названия полей точно скопированы из вашей таблицы.
 */
export type PromoCode = {
  id: number;
  code: string;
  is_active: boolean;
  
  // Названия полей из вашей таблицы Supabase:
  discount_perc: number;       // Скидка в процентах
  expires_at: string;          // Дата окончания срока действия
  times_used: number;          // Сколько раз был использован
  
  usage_limit: number | null;
  is_personal: boolean;
  user_id: string | null;
  created_at: string;
};

/**
 * Базовый тип для пользователя.
 * Источник: таблица 'users' в Supabase Auth.
 */
export type User = {
    id: string; 
    email?: string;
    full_name?: string;
    phone?: string;
};

/**
 * Базовый тип для бронирования.
 * Источник: таблица 'bookings' в Supabase.
 */
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