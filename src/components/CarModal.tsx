// Файл: src/components/CarModal.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { XMarkIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Car } from '@/types'
import FormattedPrice from './FormattedPrice'

export interface CarModalProps {
  isOpen: boolean
  onClose: () => void
  car: Car | null
  onBook: (carToBook: Car, tariff: SelectedTariff) => void;
}

type SelectedTariff = {
    serviceType: string;
    duration: string;
    price: number;
}

// Компонент для опций цены - ПЕРЕМЕЩЕН В НАЧАЛО ФАЙЛА
const PriceOption = ({ label, value, isSelected, onClick }: { label: string; value?: number; isSelected: boolean; onClick: () => void }) => {
  if (value === undefined) return null;
  return (
    <button onClick={onClick} className={`w-full flex justify-between items-baseline p-4 rounded-lg border transition-all duration-200 text-left ${isSelected ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-500'}`}>
      <span className={`text-sm ${isSelected ? 'font-semibold' : 'text-neutral-300'}`}>{label}</span>
      <span className={`text-lg font-bold ${isSelected ? '' : 'text-white'}`}><FormattedPrice value={value} /> ₸</span>
    </button>
  );
};

export default function CarModal({ isOpen, onClose, car, onBook }: CarModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTariff, setSelectedTariff] = useState<SelectedTariff | null>(null);
  
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  const finalPrice = useMemo(() => {
    if (!selectedTariff) return 0;
    const basePrice = selectedTariff.price;
    const discountPercentage = appliedPromo ? appliedPromo.discount : 0;
    return basePrice * (1 - discountPercentage / 100);
  }, [selectedTariff, appliedPromo]);

  const gallery = useMemo(() => {
    if (!car) return [];
    const images = [car.image, ...(car.galleryImages || [])].filter(Boolean).map(src => src.trim());
    return [...new Set(images)];
  }, [car]);
  const currentImage = gallery[currentImageIndex];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
      setSelectedTariff(null);
      setPromoCodeInput('');
      setAppliedPromo(null);
      setPromoMessage(null);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput) return;
    setIsPromoLoading(true);
    setPromoMessage(null);
    try {
      const response = await fetch('/api/check-promocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCodeInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAppliedPromo({ code: data.code, discount: data.discount });
      setPromoMessage(data.message);
    } catch (error: unknown) { // Изменено 'any' на 'unknown'
      setAppliedPromo(null);
      // Проверка, является ли 'error' экземпляром Error, чтобы безопасно получить .message
      setPromoMessage(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsPromoLoading(false);
    }
  };

  const handleNextImage = () => setCurrentImageIndex(prev => (prev + 1) % gallery.length);
  const handlePrevImage = () => setCurrentImageIndex(prev => (prev - 1 + gallery.length) % gallery.length);
  const handleTariffSelect = (tariff: SelectedTariff) => setSelectedTariff(tariff);
  
  const handlePrimaryBookAction = () => {
    if (!selectedTariff || !car) {
      alert('Пожалуйста, выберите тариф и убедитесь, что автомобиль выбран.');
      return;
    }
    onBook(car, { ...selectedTariff, price: finalPrice });
  };

  const renderPriceSection = (title: string, pricingData: { [key: string]: number } | undefined, serviceType: string) => {
    if (!pricingData) return null;
    return (
      <div>
        <h3 className="font-semibold text-lg text-white mb-3">{title}</h3>
        <div className="space-y-2">
            <p className="text-xs text-neutral-500">{serviceType === 'Без водителя' ? 'Условия: 200км пробег, мойка, бензин, доставка.' : 'Все включено: водитель, топливо, мойка.'}</p>
            {Object.entries(pricingData).map(([duration, price]) => (
                <PriceOption key={duration} label={`${duration}`} value={price} isSelected={selectedTariff?.serviceType === serviceType && selectedTariff?.duration === duration} onClick={() => handleTariffSelect({ serviceType, duration, price })}/>
            ))}
        </div>
      </div>
    );
  };
  
  if (!isOpen || !car) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 text-neutral-400 hover:text-white"><XMarkIcon className="h-6 w-6" /></button>
          <div className="grid md:grid-cols-2 flex-grow min-h-0">
            <div className="relative flex flex-col bg-neutral-950 min-h-0">
                <div className="relative aspect-video w-full flex-shrink-0 group">
                    {currentImage && <Image src={currentImage} alt={car.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />}
                    {gallery.length > 1 && <>
                        <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100"><ChevronLeftIcon className="h-6 w-6" /></button>
                        <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100"><ChevronRightIcon className="h-6 w-6" /></button>
                    </>}
                </div>
                {gallery.length > 1 && <div className="flex-shrink-0 flex space-x-2 p-3 bg-black/30 overflow-x-auto"><div className="flex-shrink-0 flex space-x-2 p-3 bg-black/30 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700">{gallery.map((src, i) => (src && <button key={i} onClick={() => setCurrentImageIndex(i)} className={`shrink-0 relative w-20 h-14 rounded-md overflow-hidden border-2 ${currentImageIndex === i ? 'border-[#d4af37]' : 'border-transparent hover:border-neutral-500'}`}><Image src={src} alt={`${car.name} фото ${i + 1}`} fill className="object-cover" sizes="80px" /></button>))}</div></div>}
            </div>
            <div className="flex flex-col p-6 sm:p-8 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-neutral-700">
              <div className="flex justify-between items-start gap-4 mb-3"><h2 className="text-3xl sm:text-4xl font-bold text-white">{car.name}</h2><span className="flex-shrink-0 mt-1 px-3 py-1 text-xs font-medium bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded-full">{car.class}</span></div>
              {car.description && <p className="text-neutral-400 text-sm mb-6">{car.description}</p>}
              <div className="space-y-5 flex-grow">
                {renderPriceSection('Без водителя', car.pricing?.withoutDriver, 'Без водителя')}
                {renderPriceSection('С водителем', car.pricing?.withDriver, 'С водителем')}
                {car.pricing && car.pricing.transfer && ( // Явная проверка на car.pricing
                  <PriceOption 
                    label="Трансфер" 
                    value={car.pricing.transfer} 
                    isSelected={selectedTariff?.serviceType === 'Трансфер'} 
                    onClick={() => handleTariffSelect({ serviceType: 'Трансфер', duration: 'Поездка', price: car.pricing!.transfer! })}
                  />
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-700/50 space-y-4">
                  <div>
                    <label htmlFor="promo" className="block text-sm font-medium text-neutral-300 mb-1.5">Промокод</label>
                    <div className="flex gap-2"><input id="promo" type="text" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value.toUpperCase())} placeholder="Введите код" className="flex-grow bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500" disabled={!!appliedPromo} /><button onClick={handleApplyPromoCode} disabled={isPromoLoading || !!appliedPromo || !promoCodeInput} className="px-5 py-2.5 bg-[#d4af37] text-black text-sm font-semibold rounded-lg hover:bg-[#c0982c] transition disabled:opacity-50 flex items-center justify-center w-32">{isPromoLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : (appliedPromo ? <CheckCircleIcon className="w-6 h-6" /> : 'Применить')}</button></div>
                    {promoMessage && <p className={`text-sm mt-2 ${appliedPromo ? 'text-green-400' : 'text-red-400'}`}>{promoMessage}</p>}
                  </div>
                  <button onClick={handlePrimaryBookAction} disabled={!selectedTariff} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#d4af37] text-black rounded-lg text-lg font-bold hover:bg-[#c0982c] transition disabled:bg-neutral-600 disabled:text-neutral-400">
                    <CheckCircleIcon className="h-6 w-6" /><span>{selectedTariff ? <>Забронировать за <FormattedPrice value={finalPrice} /> ₸</> : 'Выберите тариф'}</span>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}