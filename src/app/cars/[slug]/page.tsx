// src/app/cars/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { Car, Price } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper';
import Image from 'next/image';
import FormattedPrice from '@/components/FormattedPrice';
import { Zap, Clock, Fuel, Dna, Users, Info, CarFront } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

// Тип Props больше не нужен

// Загружаем машину вместе с ценами одним запросом
async function getCarData(slug: string): Promise<Car | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('cars')
    .select(`*, prices (*)`)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error(`Ошибка загрузки данных для slug "${slug}":`, error);
    return null;
  }
  return data as Car;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const car = await getCarData(params.slug);
    if (!car) { return { title: 'Автомобиль не найден' }; }
    return {
        title: `${car.name} | TopCar`,
        description: car.description || `Аренда ${car.name} в Алматы.`,
    };
}

// Компонент для отображения цен
function PriceList({ prices }: { prices: Price[] }) {
    const withoutDriver = prices.filter(p => !p.with_driver).sort((a, b) => a.days_from - b.days_from);
    const withDriver = prices.filter(p => p.with_driver).sort((a, b) => a.days_from - b.days_from);

    // Функция для правильного склонения слова "час"
    const formatHourText = (hours: number) => {
        if (hours === 24) return 'часа (сутки)';
        const cases = [2, 0, 1, 1, 1, 2]; // Падежи для 0, 1, 2, 3, 4, 5+
        const titles = ['час', 'часа', 'часов'];
        return titles[(hours % 100 > 4 && hours % 100 < 20) ? 2 : cases[(hours % 10 < 5) ? hours % 10 : 5]];
    };

    const PriceCard = ({ title, priceList, icon }: { title: string, priceList: Price[], icon?: React.ReactNode }) => (
        <div className="space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">{icon}{title}</h3>
            <div className="divide-y divide-neutral-700/50 border-t border-b border-neutral-700/50">
                {priceList.map(p => (
                    <div key={p.id} className="py-3">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-neutral-200">
                                {`${p.days_from} ${formatHourText(p.days_from)}`}
                            </span>
                            <span className="font-mono text-lg font-semibold text-[#d4af37]">
                                <FormattedPrice value={p.price_per_day} /> ₸
                            </span>
                        </div>
                        {p.conditions && <p className="text-xs text-neutral-500 mt-1">{p.conditions}</p>}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-900 border border-border rounded-2xl p-6 sm:p-8 space-y-8">
            {withoutDriver.length > 0 && <PriceCard title="Без водителя" priceList={withoutDriver} />}
            {withDriver.length > 0 && <PriceCard title="С водителем" priceList={withDriver} icon={<CarFront size={22} />} />}
        </div>
    );
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
    const car = await getCarData(params.slug);
    if (!car) { notFound(); }

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
                <div className="container mx-auto px-4 space-y-16 sm:space-y-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        <div className="space-y-4">
                            <div className="aspect-video w-full relative rounded-xl overflow-hidden border border-border shadow-lg">
                                <Image src={car.image_url} alt={car.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
                            </div>
                            {car.gallery_images && car.gallery_images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {car.gallery_images.map((imgSrc, index) => (
                                        <div key={index} className="aspect-video relative rounded-lg overflow-hidden border-2 border-transparent hover:border-[#d4af37] transition cursor-pointer">
                                            <Image src={imgSrc} alt={`${car.name} галерея ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 20vw, 10vw" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[#d4af37] font-semibold mb-2">{car.brand} - {car.class}</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{car.name}</h1>
                            <div className="prose prose-invert text-neutral-300 space-y-4 leading-relaxed">
                               <p>{car.description}</p>
                               {car.full_description && <p>{car.full_description}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                         <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Характеристики</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                {features.map(f => ( f.value !== 'н/д' && (
                                    <div key={f.label} className="bg-neutral-900 p-4 rounded-lg border border-border">
                                        <f.icon className="w-6 h-6 text-[#d4af37] mb-2" />
                                        <p className="text-neutral-400">{f.label}</p>
                                        <p className="font-semibold text-white">{f.value}</p>
                                    </div>
                                )))}
                            </div>
                         </div>
                         <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Тарифы</h2>
                            {car.prices && car.prices.length > 0 
                                ? <PriceList prices={car.prices} />
                                : <p className="text-center text-neutral-500">Прайс-лист для этого автомобиля скоро появится.</p>
                            }
                         </div>
                    </div>
                    <div className="mt-16 sm:mt-24">
                        <BookingForm initialCarName={car.name} />
                    </div>
                </div>
            </main>
            <Footer />
        </AnimatedPageWrapper>
    );
}