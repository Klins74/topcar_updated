'use client'

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import FadeInWhenVisible from './FadeInWhenVisible';
import { CheckCircleIcon, ChevronDownIcon, BookmarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Car, Price } from '@/types'; // <-- Импортируем типы Car и Price
import { getSupabase } from '@/lib/supabase';
import Image from 'next/image';
import FormattedPrice from './FormattedPrice';
import BookingModal from './BookingModal'; // <-- Импортируем модальное окно бронирования

// Определяем типы для калькулятора
type ServiceType = 'withDriver' | 'withoutDriver';
type DurationOption = {
    label: string;
    value: number;
};

export default function RentalCalculator() {
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [isCarsLoading, setIsCarsLoading] = useState(true);

  // Состояния для выбора пользователя
  const [selectedCarId, setSelectedCarId] = useState<number | string>('');
  const [serviceType, setServiceType] = useState<ServiceType>('withoutDriver');
  const [duration, setDuration] = useState<number | ''>('');
  
  // Состояния для модального окна
  const [bookingInfo, setBookingInfo] = useState<{ car: Car, details: any } | null>(null);

  // --- 1. ОБНОВЛЕННАЯ ЗАГРУЗКА ДАННЫХ ---
  // Загружаем машины вместе с их ценами одним запросом
  useEffect(() => {
    const fetchCars = async () => {
      setIsCarsLoading(true);
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('cars')
        .select('*, prices (*)') // <-- Загружаем связанные цены
        .order('id');
      
      if (error) console.error("Ошибка загрузки автомобилей с ценами:", error);
      else if (data) setCarsData(data as Car[]);
      setIsCarsLoading(false);
    };
    fetchCars();
  }, []);

  // Находим выбранный автомобиль
  const selectedCar = useMemo(() => carsData.find((c) => c.id === Number(selectedCarId)) || null, [selectedCarId, carsData]);

  // --- 2. НОВАЯ ЛОГИКА РАСЧЕТА ЦЕНЫ ---
  const { availableDurations, totalPrice } = useMemo(() => {
    if (!selectedCar || !selectedCar.prices) {
        return { availableDurations: [], totalPrice: 0 };
    }

    const isWithDriver = serviceType === 'withDriver';
    const relevantPrices = selectedCar.prices.filter(p => p.with_driver === isWithDriver);
    
    const durationOptions: DurationOption[] = relevantPrices.map(p => ({
        label: `${p.days_from}ч`,
        value: p.days_from,
    })).sort((a, b) => a.value - b.value); // Сортируем по часам

    let price = 0;
    if (duration !== '') {
        const foundPrice = relevantPrices.find(p => p.days_from === duration);
        price = foundPrice ? foundPrice.price_per_day : 0;
    }

    return { availableDurations: durationOptions, totalPrice: price };
  }, [selectedCar, serviceType, duration]);
  
  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCarId(e.target.value);
      setServiceType('withoutDriver');
      setDuration('');
  };
  
  // --- 3. НОВАЯ ЛОГИКА КНОПКИ "ОФОРМИТЬ ЗАЯВКУ" ---
  const handleBookingSubmit = () => {
    if (!selectedCar || !duration || totalPrice === 0) {
        alert("Пожалуйста, выберите все опции для расчета.");
        return;
    }

    const bookingDetails = {
        serviceType: serviceType === 'withDriver' ? 'С водителем' : 'Без водителя',
        duration: `${duration}ч`,
        price: totalPrice,
    };
    
    setBookingInfo({ car: selectedCar, details: bookingDetails });
  };
  
  const basePriceForDisplay = selectedCar?.prices?.find(p => !p.with_driver && p.days_from === 24)?.price_per_day;

  return (
    <>
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 sm:mb-16 text-center tracking-tight text-white">
              Рассчитать <span className="text-[#d4af37]">стоимость</span>
              <span className="block w-24 h-1 bg-[#d4af37] mx-auto mt-4"></span>
            </h2>
  
            <div className="space-y-6 bg-neutral-900 border border-neutral-700 p-6 sm:p-10 rounded-2xl shadow-2xl">
              <div>
                <label htmlFor="carSelectCalc" className="block text-sm font-medium text-neutral-300 mb-2">1. Выберите автомобиль</label>
                <div className="relative">
                  <select id="carSelectCalc" className="w-full pl-3 pr-10 py-3 text-base text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none" value={selectedCarId} onChange={handleCarChange} disabled={isCarsLoading}>
                    <option value="" disabled className="text-neutral-500">{isCarsLoading ? 'Загрузка...' : 'Модель автомобиля...'}</option>
                    {carsData.map((car) => (<option key={car.id} value={car.id} className="bg-neutral-800 text-white">{car.name}</option>))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400"><ChevronDownIcon className="h-5 w-5" /></div>
                </div>
                {selectedCar && (
                  <div className="mt-4 p-3 bg-neutral-800/50 rounded-lg flex items-center gap-4 border-neutral-700">
                    <Image src={selectedCar.image_url.trim()} alt={selectedCar.name} width={80} height={45} className="rounded-md object-cover aspect-[16/9]" />
                    <div>
                      <p className="font-semibold text-white">{selectedCar.name}</p>
                      {basePriceForDisplay && (<p className="text-xs text-neutral-400"><FormattedPrice value={basePriceForDisplay} /> ₸/день</p>)}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedCar && (
                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">2. Выберите тип услуги</label>
                      <div className="grid grid-cols-2 rounded-lg bg-neutral-800 p-1">
                          <button type="button" onClick={() => { setServiceType('withoutDriver'); setDuration(''); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${serviceType === 'withoutDriver' ? 'bg-[#d4af37] text-black shadow' : 'text-neutral-300 hover:bg-neutral-700'}`}>Без водителя</button>
                          <button type="button" onClick={() => { setServiceType('withDriver'); setDuration(''); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${serviceType === 'withDriver' ? 'bg-[#d4af37] text-black shadow' : 'text-neutral-300 hover:bg-neutral-700'}`}>С водителем</button>
                      </div>
                  </div>
              )}
              
              {selectedCar && availableDurations.length > 0 && (
                  <div>
                      <label htmlFor="durationSelect" className="block text-sm font-medium text-neutral-300 mb-2">3. Выберите продолжительность</label>
                      <div className="relative">
                          <select id="durationSelect" className="w-full pl-3 pr-10 py-3 text-base text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                              <option value="" disabled className="text-neutral-500">Время аренды...</option>
                              {availableDurations.map(d => (<option key={d.value} value={d.value} className="bg-neutral-800 text-white">{d.label}</option>))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400"><ChevronDownIcon className="h-5 w-5" /></div>
                      </div>
                  </div>
              )}
  
              {totalPrice > 0 && selectedCar && (
                <div className="mt-6 pt-6 border-t border-neutral-700 text-center">
                  <p className="text-sm text-neutral-300 mb-1">Итоговая стоимость:</p>
                  <div className="text-3xl sm:text-4xl font-bold text-[#d4af37] mb-1"><FormattedPrice value={totalPrice} /> ₸</div>
                  <p className="text-sm text-neutral-400">за {duration}ч на {selectedCar.name}</p>
                </div>
              )}
              
              <button type="button" onClick={handleBookingSubmit} disabled={totalPrice === 0 || !selectedCarId} className="w-full mt-4 sm:mt-6 px-8 py-4 bg-[#d4af37] text-black rounded-lg text-base sm:text-lg font-semibold hover:bg-[#c0982c] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 mr-2 hidden sm:inline" /> Оформить заявку</span>
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Рендерим модальное окно, когда есть информация для бронирования */}
      {bookingInfo && (
        <BookingModal 
          isOpen={!!bookingInfo}
          onClose={() => setBookingInfo(null)}
          carName={bookingInfo.car.name}
          bookingDetails={bookingInfo.details}
        />
      )}
    </>
  )
}