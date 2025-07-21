// src/components/CarCatalog.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDownIcon, FunnelIcon, NoSymbolIcon } from '@heroicons/react/24/outline'
import FadeInWhenVisible from './FadeInWhenVisible'
import { Car } from '@/types'
import { getSupabase } from '@/lib/supabase'
import FormattedPrice from './FormattedPrice'
import SkeletonCard from './SkeletonCard'

const MIN_PRICE = 30000;
const MAX_PRICE = 500000;

// --- КОМПОНЕНТ КАРТОЧКИ АВТОМОБИЛЯ ---
function CarCard({ car }: { car: Car; }) {
  // Проверяем, что car.prices существует и является массивом
  const basePrice = car.prices?.find(p => !p.with_driver && p.days_from === 24)?.price_per_day || car.price_per_day || 0;

  // Добавляем логирование для отладки цен в карточках
  console.log(`CarCard: Car "${car.name}" (ID: ${car.id}) - prices:`, car.prices);
  console.log(`CarCard: Car "${car.name}" (ID: ${car.id}) - price_per_day from cars table:`, car.price_per_day);
  console.log(`CarCard: Car "${car.name}" (ID: ${car.id}) - calculated basePrice:`, basePrice);


  return (
    <Link
      href={`/cars/${car.slug}`}
      className="relative group aspect-[16/10] w-full rounded-xl overflow-hidden shadow-xl cursor-pointer bg-black transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out flex-grow"
    >
      <Image
        src={car.image_url || '/cars/placeholder-car.png'}
        alt={car.name || 'Название автомобиля'}
        fill
        className="transition-transform duration-500 ease-in-out group-hover:scale-110 object-cover"
        priority={car.id <= 3}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={(e) => { (e.target as HTMLImageElement).src = '/cars/placeholder-car.png'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-white z-10 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
        <h3 className="text-lg font-bold mb-2">{car.name || 'Название автомобиля'}</h3>
        <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 sm:line-clamp-4">
          {car.description || 'Превосходный автомобиль для ваших поездок.'}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white z-20 
                       group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight leading-tight mb-0.5 truncate" title={car.name}>
          {car.name || 'Название автомобиля'}
        </h3>
        {basePrice > 0 ? (
          <p className="text-sm sm:text-base font-semibold text-[#d4af37]">
            <FormattedPrice value={basePrice} /> ₸ <span className="text-xs text-white/70">/ 24 часа</span>
          </p>
        ) : (
          <p className="text-sm sm:text-base font-semibold text-[#d4af37]">
            Подробнее
          </p>
        )}
      </div>
    </Link>
  )
}


// --- ОСНОВНОЙ КОМПОНЕНТ КАТАЛОГА ---
export default function CarCatalog() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedClass, setSelectedClass] = useState<'Economy' | 'Business' | 'Premium' | 'Luxury' | ''>('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('cars')
        .select('*, prices (*)') // Важно: убедитесь, что это действительно работает и возвращает prices
        .order('id'); 

      if (error) {
        console.error("Ошибка загрузки автомобилей с ценами из Supabase:", error);
        alert(`Ошибка загрузки данных: ${error.message}`);
      } else if (data) {
        console.log("Данные из Supabase для CarCatalog (со всеми ценами):", data); // Добавлено логирование
        setAllCars(data as Car[]);
      }
      setIsLoading(false);
    };
    fetchCars();
  }, []);

  const allBrands = useMemo(() => {
    return [...new Set(allCars.map(c => c.brand).filter(Boolean))].sort();
  }, [allCars]);

  const allClasses = useMemo(() => {
    const uniqueClasses = [...new Set(allCars.map(c => c.class).filter(Boolean))];
    const definedClasses = ['Economy', 'Business', 'Premium', 'Luxury'];
    return [...new Set([...definedClasses, ...uniqueClasses])].sort();
  }, [allCars]);
  
  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
        const dailyPrice = car.prices?.find(p => !p.with_driver && p.days_from === 24)?.price_per_day || car.price_per_day || 0;
        return (
          dailyPrice <= maxPrice &&
          (!selectedBrand || car.brand === selectedBrand) &&
          (!selectedClass || car.class === selectedClass)
        );
    });
  }, [allCars, maxPrice, selectedBrand, selectedClass]);
  
  const resetFilters = () => {
    setMaxPrice(MAX_PRICE);
    setSelectedBrand('');
    setSelectedClass('');
    setShowFiltersMobile(false);
  };

  const pricePercentage = MAX_PRICE > MIN_PRICE ? ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100 : 0;

  return (
    <section id="car-catalog" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <FadeInWhenVisible>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 sm:mb-12 text-center tracking-tight text-white">
                Наш <span className="text-[#d4af37]">автопарк</span>
                <span className="block w-20 h-0.5 bg-[#d4af37]/50 mx-auto mt-4"></span>
            </h2>
        </FadeInWhenVisible>

        <div className="md:hidden mb-6 text-center">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800/70 border border-neutral-700 rounded-lg text-white hover:bg-neutral-700/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 shadow-md"
          >
            <FunnelIcon className="h-5 w-5 text-[#d4af37]" />
            <span>{showFiltersMobile ? 'Скрыть фильтры' : 'Показать фильтры'}</span>
            <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${showFiltersMobile ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <FadeInWhenVisible 
          className={`${showFiltersMobile ? 'block animate-fadeInUp' : 'hidden'} md:block mb-10 sm:mb-12`} 
        >
          <div 
            className="max-w-5xl mx-auto bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-xl p-4 sm:p-6 backdrop-blur-md"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 items-end">
              <div className="lg:col-span-2">
                <label htmlFor="priceRange" className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2">
                  Цена до: <span className="font-bold text-lg text-[#d4af37]"><FormattedPrice value={maxPrice} /> ₸</span>
                  <span className="text-neutral-400 text-xs"> / день</span>
                </label>
                <input
                  id="priceRange"
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={10000}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full h-3 bg-transparent appearance-none cursor-pointer group focus:outline-none [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-neutral-700 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-neutral-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#d4af37] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-in-out [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-125 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#d4af37] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:ease-in-out [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-125"
                  style={{ background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${pricePercentage}%, #404040 ${pricePercentage}%, #404040 100%)` }}
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span><FormattedPrice value={MIN_PRICE} /> ₸</span>
                    <span><FormattedPrice value={MAX_PRICE} /> ₸</span>
                </div>
              </div>
              <div>
                <label htmlFor="classFilter" className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5">Класс</label>
                <div className="relative">
                  <select id="classFilter" className="w-full pl-3 pr-10 py-2.5 text-sm text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none" value={selectedClass} onChange={e => setSelectedClass(e.target.value as typeof selectedClass)}>
                    <option value="" className="text-neutral-400 bg-neutral-800">Все классы</option>
                    {allClasses.map(c => (<option key={c} value={c} className="text-white bg-neutral-800">{c}</option>))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400"><ChevronDownIcon className="h-5 w-5" /></div>
                </div>
              </div>
              <div>
                <label htmlFor="brandFilter" className="block text-xs sm:text-sm font-medium text-neutral-300 mb-1.5">Марка</label>
                  <div className="relative">
                    <select id="brandFilter" className="w-full pl-3 pr-10 py-2.5 text-sm text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                        <option value="" className="text-neutral-400 bg-neutral-800">Все марки</option>
                        {allBrands.map(b => (<option key={b} value={b} className="text-white bg-neutral-800">{b}</option>))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400"><ChevronDownIcon className="h-5 w-5" /></div>
                  </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {isLoading ? (
            <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (<SkeletonCard key={index} />))}
            </div>
        ) : filteredCars.length > 0 ? (
            <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCars.map(car => (
                <FadeInWhenVisible key={car.id} className="flex">
                    <CarCard car={car} />
                </FadeInWhenVisible>
                ))}
            </div>
        ) : (
            <FadeInWhenVisible>
                <div className="text-center py-16 sm:py-20">
                    <NoSymbolIcon className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-neutral-300 mb-2">Автомобили не найдены</p>
                    <p className="text-neutral-400 mb-6">Попробуйте изменить критерии поиска.</p>
                    <button onClick={resetFilters} className="px-5 py-2.5 text-sm font-semibold text-black bg-[#d4af37] rounded-lg hover:bg-[#c0982c] transition-colors">
                        Сбросить все фильтры
                    </button>
                </div>
            </FadeInWhenVisible>
        )}
      </div>
    </section>
  )
}