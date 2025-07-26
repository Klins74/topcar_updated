// src/app/cars/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper';
import BookingForm from '@/components/BookingForm';
import { getSupabase } from '@/lib/supabase';
import { Car } from '@/types';

// Исправляем предупреждения: удаляем неиспользуемые импорты
import {
  Zap, Fuel, Dna, Users, Info, ClockIcon, MessageSquare
} from 'lucide-react';
// DollarSign, PhoneIcon, CalendarDaysIcon были удалены, так как они не используются напрямую здесь.
// Если они нужны для других целей, используйте их в соответствующих компонентах.


// Функция для получения деталей автомобиля из Supabase
async function getCarDetails(slug: string): Promise<Car | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('cars')
    .select('*, prices (*)') // Выбираем все поля из cars и связанные цены
    .eq('slug', slug) // Фильтруем по slug
    .single(); // Ожидаем одну запись

  if (error) {
    console.error(`Ошибка загрузки автомобиля по slug "${slug}":`, error.message);
    return null;
  }
  return data as Car | null;
}

// Если вы хотите использовать динамические метаданные
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { // ИЗМЕНЕНИЕ ТИПА ЗДЕСЬ
  // Ожидаем params, как того требует компилятор, несмотря на то, что это не обычный Promise
  const { slug } = await params; 
  
  const car = await getCarDetails(slug); 

  if (!car) {
    return {
      title: 'Автомобиль не найден | TopCar Almaty',
      description: 'Запрашиваемый автомобиль не найден в нашем автопарке.',
    };
  }

  return {
    title: `${car.name} | Аренда Авто в Алматы | TopCar`,
    description: car.description,
    openGraph: {
      images: car.image_url,
    },
  };
}

// Эта функция генерирует статические параметры (slug) для всех страниц
export async function generateStaticParams() {
  const supabase = getSupabase();
  const { data: cars, error } = await supabase.from('cars').select('slug');

  if (error) {
    console.error("Ошибка при генерации статических параметров:", error.message);
    return [];
  }
  
  return cars.map(car => ({ slug: car.slug }));
}


export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) { // ИЗМЕНЕНИЕ ТИПА ЗДЕСЬ
  // Ожидаем params, как того требует компилятор
  const { slug } = await params;

  // Теперь car будет содержать данные из Supabase
  const car = await getCarDetails(slug);

  if (!car) {
    notFound(); // Отобразит страницу 404, если автомобиль не найден
  }

  // Здесь вы можете определить, как отображаются цены,
  // например, всегда показывать цену за 24 часа для простоты на этой странице
  // Убедитесь, что у вас есть price_per_day или логика для его вычисления из prices
  const dailyPrice = car.prices?.find(p => !p.with_driver && p.days_from === 24)?.price_per_day || car.price_per_day || 0; 

  const features = [
    { icon: Zap, label: 'Мощность', value: car.power ? `${car.power} л.с.` : 'н/д' },
    { icon: Info, label: 'Год выпуска', value: car.year || 'н/д' },
    { icon: Fuel, label: 'Тип топлива', value: car.fuel_type || 'н/д' },
    { icon: Dna, label: 'Привод', value: car.drive_type || 'н/д' },
    { icon: Users, label: 'Кол-во мест', value: car.seats || 'н/д' },
    { icon: ClockIcon, label: 'Разгон до 100', value: car.acceleration ? `${car.acceleration} сек` : 'н/д' },
  ];

  return (
    <AnimatedPageWrapper>
      <Header />
      <main className="min-h-screen bg-neutral-950 text-white font-sans pt-24">
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery / Main Image */}
            <div className="space-y-6">
              <div className="aspect-video w-full relative rounded-xl overflow-hidden shadow-2xl bg-neutral-800 border border-neutral-700">
                <Image
                  src={car.image_url}
                  alt={car.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw" 
                />
              </div>
              {car.gallery_images && car.gallery_images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {car.gallery_images.map((img, index) => (
                    <div key={index} className="aspect-video relative rounded-md overflow-hidden bg-neutral-800">
                      <Image
                        src={img}
                        alt={`${car.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 25vw" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details and Booking Form */}
            <div className="lg:sticky lg:top-28 self-start space-y-8 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-xl p-6 sm:p-8">
              <div>
                <p className="text-sm font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                  {car.brand} &bull; {car.class}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {car.name}
                </h1>
                <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                  {car.full_description || car.description}
                </p>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-4 text-sm border-t border-neutral-800 pt-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-[#d4af37] flex-shrink-0" />
                    <div>
                      <p className="text-neutral-400">{feature.label}:</p>
                      <p className="font-semibold text-white">{feature.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing & Call to Action */}
              <div className="border-t border-neutral-800 pt-6">
                <p className="text-sm text-neutral-300 mb-2">Стоимость аренды (от 24ч):</p>
                <p className="text-4xl font-bold text-[#d4af37] mb-6">
                  {dailyPrice.toLocaleString('ru-RU')} ₸ <span className="text-lg text-neutral-400">/ день</span>
                </p>
                
                {/* Заголовок формы бронирования */}
                <h3 className="text-2xl font-bold text-white mb-6 mt-8">
                    Заявка на <span className="text-[#d4af37]">бронирование</span>
                </h3>

                {/* Контейнер для BookingForm - используем flexbox для выравнивания */}
                <div className="flex flex-col gap-6"> 
                    <BookingForm initialCarName={car.name} /> 

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </AnimatedPageWrapper>
  );
}