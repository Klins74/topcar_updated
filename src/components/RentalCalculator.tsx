'use client'

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import FadeInWhenVisible from './FadeInWhenVisible';
import { CheckCircleIcon, ChevronDownIcon, EnvelopeIcon, BookmarkIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Car } from '@/data/cars';
import { getSupabase } from '@/lib/supabase';
import Image from 'next/image';
import FormattedPrice from './FormattedPrice';
import LoginModal from './LoginModal';

type ServiceType = 'withoutDriver' | 'withDriver' | 'transfer';
type DurationKey = '3h' | '6h' | '12h' | '24h';

export default function RentalCalculator() {
  const { user } = useAuth(); 
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [isCarsLoading, setIsCarsLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState<number | string>('');
  const [serviceType, setServiceType] = useState<ServiceType>('withoutDriver');
  const [duration, setDuration] = useState<DurationKey | ''>('');
  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      setIsCarsLoading(true);
      const supabase = getSupabase();
      const { data, error } = await supabase.from('cars').select('*').order('id');
      if (error) console.error("Ошибка загрузки автомобилей:", error);
      else if (data) setCarsData(data as Car[]);
      setIsCarsLoading(false);
    };
    fetchCars();
  }, []);

  const handleSaveCalculation = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!selectedCar || isActionLoading) return;

    setIsActionLoading(true);
    setActionMessage(null);
    try {
      const response = await fetch('/api/save-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculation: { carName: selectedCar.name, serviceType, duration, price: totalPrice }
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setActionMessage({ type: 'success', text: 'Расчет успешно сохранен!' });
    } catch (err: unknown) { // ИЗМЕНЕНИЕ ЗДЕСЬ
      setActionMessage({ type: 'error', text: (err as Error).message || 'Не удалось сохранить расчет.' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendToEmail = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!selectedCar || isActionLoading) return;
    
    setIsActionLoading(true);
    setActionMessage(null);
    try {
      const response = await fetch('/api/send-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          calculation: { carName: selectedCar.name, serviceType, duration, price: totalPrice }
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setActionMessage({ type: 'success', text: `Расчет отправлен на вашу почту!` });
    } catch (err: unknown) { // ИЗМЕНЕНИЕ ЗДЕСЬ
      setActionMessage({ type: 'error', text: (err as Error).message || 'Не удалось отправить на почту.' });
    } finally {
      setIsActionLoading(false);
    }
  };
  
  const selectedCar = useMemo(() => carsData.find((c) => c.id === Number(selectedCarId)) || null, [selectedCarId, carsData]);
  const totalPrice = useMemo(() => {
    if (!selectedCar || !serviceType) return 0;
    const servicePricing = selectedCar.pricing[serviceType];
    if (!servicePricing) return 0;
    if (serviceType === 'transfer') return servicePricing as number;
    if (duration && Object.prototype.hasOwnProperty.call(servicePricing, duration)) {
        // Убрали any, используя явное приведение типа
        return (servicePricing as Record<DurationKey, number>)[duration];
    }
    return 0;
  }, [selectedCar, serviceType, duration]);

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCarId(e.target.value);
      setServiceType('withoutDriver');
      setDuration('');
      setActionMessage(null);
  };
  
  const getAvailableDurations = (): DurationKey[] => {
      if (!selectedCar || !serviceType || serviceType === 'transfer') return [];
      const pricing = selectedCar.pricing[serviceType];
      return pricing ? Object.keys(pricing) as DurationKey[] : [];
  };

  const basePriceForDisplay = selectedCar?.pricing?.withoutDriver?.['24h'];

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
                {selectedCar && selectedCar.image && (
                  <div className="mt-4 p-3 bg-neutral-800/50 rounded-lg flex items-center gap-4 border-neutral-700">
                    <Image src={selectedCar.image.trim()} alt={selectedCar.name} width={80} height={45} className="rounded-md object-cover aspect-[16/9]" />
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-lg bg-neutral-800 p-1">
                          {selectedCar.pricing.withoutDriver && <button type="button" onClick={() => { setServiceType('withoutDriver'); setDuration(''); setActionMessage(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${serviceType === 'withoutDriver' ? 'bg-[#d4af37] text-black shadow' : 'text-neutral-300 hover:bg-neutral-700'}`}>Без водителя</button>}
                          {selectedCar.pricing.withDriver && <button type="button" onClick={() => { setServiceType('withDriver'); setDuration(''); setActionMessage(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${serviceType === 'withDriver' ? 'bg-[#d4af37] text-black shadow' : 'text-neutral-300 hover:bg-neutral-700'}`}>С водителем</button>}
                          {selectedCar.pricing.transfer && <button type="button" onClick={() => { setServiceType('transfer'); setDuration(''); setActionMessage(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${serviceType === 'transfer' ? 'bg-[#d4af37] text-black shadow' : 'text-neutral-300 hover:bg-neutral-700'}`}>Трансфер</button>}
                      </div>
                  </div>
              )}
              
              {selectedCar && serviceType !== 'transfer' && getAvailableDurations().length > 0 && (
                  <div>
                      <label htmlFor="durationSelect" className="block text-sm font-medium text-neutral-300 mb-2">3. Выберите продолжительность</label>
                      <div className="relative">
                          <select id="durationSelect" className="w-full pl-3 pr-10 py-3 text-base text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none" value={duration} onChange={(e) => {setDuration(e.target.value as DurationKey); setActionMessage(null); }}>
                              <option value="" disabled className="text-neutral-500">Время аренды...</option>
                              {getAvailableDurations().map(d => (<option key={d} value={d} className="bg-neutral-800 text-white">{d}</option>))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400"><ChevronDownIcon className="h-5 w-5" /></div>
                      </div>
                  </div>
              )}
  
              {totalPrice > 0 && selectedCar && (
                <div className="mt-6 pt-6 border-t border-neutral-700 text-center">
                  <p className="text-sm text-neutral-300 mb-1">Итоговая стоимость:</p>
                  <div className="text-3xl sm:text-4xl font-bold text-[#d4af37] mb-1"><FormattedPrice value={totalPrice} /> ₸</div>
                  <p className="text-sm text-neutral-400">{serviceType === 'transfer' ? 'за поездку' : `за ${duration}`} на {selectedCar.name}</p>
  
                  <div className="mt-6 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                          <button onClick={handleSendToEmail} disabled={isActionLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50">
                              {isActionLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin"/> : <EnvelopeIcon className="h-5 w-5"/>} <span>Отправить на почту</span>
                          </button>
                          <button onClick={handleSaveCalculation} disabled={isActionLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50">
                              {isActionLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin"/> : <BookmarkIcon className="h-5 w-5"/>} <span>Сохранить в ЛК</span>
                          </button>
                      </div>
                      {actionMessage && (<p className={`flex items-center justify-center gap-2 text-xs ${actionMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {actionMessage.type === 'error' && <ExclamationTriangleIcon className='h-4 w-4'/>} {actionMessage.text}
                      </p>)}
                  </div>
                </div>
              )}
              
              <button type="button" onClick={() => {if (totalPrice > 0 && selectedCar) { alert(`Заявка на ${selectedCar.name} отправлена!`);} else { alert("Пожалуйста, выберите все опции");}}} disabled={totalPrice === 0 || !selectedCarId} className="w-full mt-4 sm:mt-6 px-8 py-4 bg-[#d4af37] text-black rounded-lg text-base sm:text-lg font-semibold hover:bg-[#c0982c] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="flex items-center justify-center"><CheckCircleIcon className="h-5 w-5 mr-2 hidden sm:inline" /> Оформить заявку</span>
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  )
}