// src/types/index.ts

// Тип для автомобиля
export type Car = {
  id: number
  name: string
  image: string
  galleryImages?: string[];
  brand: string
  class: 'Economy' | 'Business' | 'Premium' | 'Luxury'
  description?: string
  pricing?: {
    withoutDriver?: { [key: string]: number };
    withDriver?: { [key: string]: number };
    transfer?: number;
  }
}

// Тип для пользователя
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Тип для бронирования
export interface Booking {
  id: string
  car_name: string
  user_name?: string
  user_phone: string
  date_from: string
  date_to: string
  created_at: string
  status?: 'confirmed' | 'active' | 'completed' | 'cancelled' 
  total_price?: number
  car_image_url?: string
}

// Тип для промокода - ИЗМЕНЕНИЯ ЗДЕСЬ
export interface PromoCode {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at?: string;
  usage_limit?: number; // Добавляем usage_limit
  times_used?: number;  // Добавляем times_used
}