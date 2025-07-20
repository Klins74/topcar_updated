// src/app/cars/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { Car } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper';
import Image from 'next/image';
import FormattedPrice from '@/components/FormattedPrice';
// --- ИЗМЕНЕНИЕ ЗДЕСЬ: Заменили SteeringWheel на CarFront ---
import { Zap, Clock, Fuel, Dna, Users, Info, CarFront } from 'lucide-react'; 
import BookingForm from '@/components/BookingForm';

type Props = {
  params: {
    slug: string;
  };
};

// --- Функция для загрузки данных об автомобиле ---
async function getCarData(slug: string): Promise<Car | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error(`Ошибка загрузки данных для slug "${slug}":`, error);
    return null;
  }
  return data as Car;
}

// --- Динамическая генерация метаданных для SEO ---
export async function generateMetadata({ params }: Props) {
    const car = await getCarData(params.slug);
    if (!car) {
        return { title: 'Автомобиль не найден' };
    }
    return {
        title: `${car.name} | TopCar`,
        description: car.description || `Аренда ${car.name} в Алматы. Лучшие условия и сервис от TopCar.`,
    };
}

// --- Основной компонент страницы ---
export default async function CarDetailPage({ params }: Props) {
    const car = await getCarData(params.slug);

    if (!car) {
        notFound();
    }
    
    const dailyPrice = car.pricing?.withoutDriver?.['24h'] || car.price_per_day || 0;

    const features = [
      { icon: Zap, label: 'Мощность', value: car.power ? `${car.power} л.с.` : 'н/д' },
      { icon: Clock, label: 'Разгон до 100', value: car.acceleration ? `${car.acceleration} сек` : 'н/д' },
      { icon: Fuel, label: 'Тип топлива', value: car.fuel_type || 'н/д' },
      { icon: Dna, label: 'Привод', value: car.drive_type || 'н/д' },
      { icon: Users, label: 'Кол-во мест', value: car.seats || 'н/д' },
      { icon: Info, label: 'Год выпуска', value: car.year || 'н/д' },
    ];

    return (
        <AnimatedPageWrapper>
            <Header />
            <main className="bg-background py-28 sm:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        
                        {/* Левая колонка: Галерея и характеристики */}
                        <div className="space-y-6">
                            <div className="aspect-video w-full relative rounded-xl overflow-hidden border border-border shadow-lg">
                                <Image
                                    src={car.image_url}
                                    alt={car.name}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            {car.gallery_images && car.gallery_images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {car.gallery_images.map((imgSrc, index) => (
                                        <div key={index} className="aspect-video relative rounded-lg overflow-hidden border-2 border-transparent hover:border-[#d4af37] transition cursor-pointer">
                                            <Image
                                                src={imgSrc}
                                                alt={`${car.name} галерея ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 20vw, 10vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-4">
                                {features.map(f => (
                                    f.value !== 'н/д' && (
                                        <div key={f.label} className="bg-neutral-900 p-4 rounded-lg border border-border">
                                            <f.icon className="w-6 h-6 text-[#d4af37] mb-2" />
                                            <p className="text-neutral-400">{f.label}</p>
                                            <p className="font-semibold text-white">{f.value}</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Правая колонка: Описание и цена */}
                        <div className="flex flex-col">
                            <p className="text-[#d4af37] font-semibold mb-2">{car.brand} - {car.class}</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{car.name}</h1>
                            <div className="prose prose-invert text-neutral-300 space-y-4 leading-relaxed">
                               <p>{car.description}</p>
                               {car.full_description && <p>{car.full_description}</p>}
                            </div>
                            
                            <div className="mt-auto pt-8">
                              <div className="bg-neutral-900 border border-border rounded-xl p-6 divide-y divide-neutral-700">
                                  {/* Цена без водителя */}
                                  <div className="py-3">
                                    <p className="text-sm text-neutral-400">Аренда без водителя</p>
                                    <p className="text-4xl font-bold text-[#d4af37]">
                                        <FormattedPrice value={dailyPrice} /> ₸
                                        <span className="text-lg text-neutral-400 font-medium"> / день</span>
                                    </p>
                                  </div>
                                  
                                  {/* Цена с водителем (появляется, если есть) */}
                                  {car.price_with_driver && (
                                    <div className="py-3">
                                        <p className="text-sm text-neutral-400 flex items-center gap-2">
                                            {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ: Заменили иконку --- */}
                                            <CarFront size={16} />
                                            Аренда с водителем
                                        </p>
                                        <p className="text-4xl font-bold text-[#d4af37]">
                                            <FormattedPrice value={car.price_with_driver} /> ₸
                                            <span className="text-lg text-neutral-400 font-medium"> / день</span>
                                        </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                        </div>
                    </div>

                    {/* Форма бронирования */}
                    <div className="mt-16 sm:mt-24">
                        <BookingForm initialCarName={car.name} />
                    </div>
                </div>
            </main>
            <Footer />
        </AnimatedPageWrapper>
    );
}