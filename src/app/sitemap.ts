// Файл: src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Обратите внимание: мы используем переменные окружения напрямую,
// так как этот код выполняется на сервере во время сборки.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL или Anon Key не определены в переменных окружения.');
}

// Создаем клиент Supabase для получения данных
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.topcar.club'; // Укажите основной URL вашего сайта

  // 1. Получаем все автомобили из базы данных
  const { data: cars, error: carsError } = await supabase
    .from('cars') // Убедитесь, что ваша таблица с машинами называется 'cars'
    .select('id, updated_at'); // Нам нужен 'id' для ссылки и 'updated_at' для даты

  if (carsError) {
    console.error("Ошибка при получении автомобилей для sitemap:", carsError);
    // В случае ошибки, возвращаем только статические страницы
    return [
        { url: siteUrl, lastModified: new Date() },
        { url: `${siteUrl}/services`, lastModified: new Date() },
        { url: `${site_url}/contacts`, lastModified: new Date() },
    ];
  }

  // 2. Создаем URL для каждого автомобиля
  const carUrls = cars.map((car) => {
    return {
      url: `${siteUrl}/car/${car.id}`, // Убедитесь, что у вас есть страницы для отдельных авто
      lastModified: new Date(car.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  }) as MetadataRoute.Sitemap;

  // 3. Добавляем основные статические страницы
  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 4. Объединяем статические URL и URL автомобилей
  return [...staticUrls, ...carUrls];
}