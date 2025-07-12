// src/components/CarModal.tsx
'use client'

import { useState, useEffect, useMemo } from 'react' // <--- ИСПРАВЛЕНИЕ 1: Добавлен useMemo
import Image from 'next/image'
import { XMarkIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Car } from '@/types'
import BookingModal from './BookingModal'
import FormattedPrice from './FormattedPrice'

export interface CarModalProps {
  isOpen: boolean
  onClose: () => void
  car: Car | null
  onBook?: (car: Car, tariff: SelectedTariff) => void;
}

type SelectedTariff = {
    serviceType: string;
    duration: string;
    price: number;
}

const PriceOption = ({ label, value, isSelected, onClick }: { label: string; value?: number; isSelected: boolean; onClick: () => void }) => {
  if (value === undefined) return null;
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-baseline p-4 rounded-lg border transition-all duration-200 text-left
                  ${isSelected
                    ? 'bg-[#d4af37] border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                    : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-500'}`
      }
    >
      <span className={`text-sm ${isSelected ? 'text-black font-semibold' : 'text-neutral-300'}`}>{label}</span>
      <span className={`text-lg font-bold ${isSelected ? 'text-black' : 'text-white'}`}><FormattedPrice value={value} /> ₸</span>
    </button>
  );
};

export default function CarModal({ isOpen, onClose, car, onBook }: CarModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTariff, setSelectedTariff] = useState<SelectedTariff | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const gallery = useMemo(() => {
    if (!car) return [];
    // Собираем все изображения, проверяя их наличие, и убираем пробелы
    const images = [
        car.image,
        ...(car.galleryImages || [])
    ].filter(src => typeof src === 'string' && src).map(src => src!.trim());
    return [...new Set(images)]; // Убираем дубликаты, если основное фото есть в галерее
  }, [car]);

  const currentImage = gallery[currentImageIndex];

  useEffect(() => {
    if (isOpen && car) {
      document.body.style.overflow = 'hidden'
      setCurrentImageIndex(0)
      setSelectedTariff(null);
      setShowBookingModal(false);
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, car])

  const handleNextImage = () => {
    if (gallery.length === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    if (gallery.length === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length);
  };

  if (!isOpen || !car) return null

  const handleTariffSelect = (tariff: SelectedTariff) => {
    setSelectedTariff(tariff);
  };

  const handlePrimaryBookAction = () => {
    if (selectedTariff) {
      if (onBook) {
        onBook(car, selectedTariff);
      } else {
        setShowBookingModal(true);
      }
    } else {
      alert('Пожалуйста, выберите тариф для бронирования.');
    }
  };

  const renderPriceSection = (title: string, pricingData: { [key: string]: number } | undefined, serviceType: string) => {
    if (!pricingData) return null;
    return (
        <div>
            <h3 className="font-semibold text-lg text-white mb-3">{title}</h3>
            <div className="space-y-2">
                <p className="text-xs text-neutral-500">{serviceType === 'Без водителя' ? 'Условия: 200км пробег, бесплатная мойка, бензин, доставка.' : 'Все включено: услуги водителя, топливо, мойка.'}</p>
                {Object.entries(pricingData).map(([duration, price]) => (
                    <PriceOption
                        key={duration}
                        label={`${duration} часов`}
                        value={price}
                        isSelected={selectedTariff?.serviceType === serviceType && selectedTariff?.duration === duration}
                        onClick={() => handleTariffSelect({ serviceType, duration, price })}
                    />
                ))}
            </div>
        </div>
    )
  }

  return (
    <>
      <div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
      >
        <div
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700
                     rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh]
                     flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            aria-label="Закрыть"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="grid md:grid-cols-2 flex-grow min-h-0">
            <div className="relative flex flex-col bg-neutral-950 min-h-0">
              <div className="relative aspect-video w-full flex-shrink-0 group">
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt={car.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw" // <-- ИСПРАВЛЕНИЕ 2: Добавлены sizes
                  />
                )}
                {gallery.length > 1 && (
                  <>
                    <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100">
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="flex-shrink-0 flex space-x-2 p-3 bg-black/30 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                  {gallery.map((src, i) => (
                    src && <button key={i} onClick={() => setCurrentImageIndex(i)} className={`flex-shrink-0 relative w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === i ? 'border-[#d4af37] scale-105 shadow-lg' : 'border-transparent hover:border-neutral-500'}`}>
                      <Image src={src} alt={`${car.name} фото ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-8 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-neutral-700">
              <div className="flex justify-between items-start gap-4 mb-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{car.name}</h2>
                  <span className="flex-shrink-0 mt-1 px-3 py-1 text-xs font-medium bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded-full">{car.class}</span>
              </div>

              {car.description && <p className="text-neutral-400 text-sm sm:text-base mb-6">{car.description}</p>}

              <div className="space-y-5 flex-grow">
                {renderPriceSection('Без водителя', car.pricing.withoutDriver, 'Без водителя')}
                {renderPriceSection('С водителем', car.pricing.withDriver, 'С водителем')}
                 {car.pricing.transfer && (
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Трансфер</h3>
                    <div className="space-y-2">
                       <p className="text-xs text-neutral-500">Фиксированная цена за поездку из точки А в точку Б.</p>
                       <PriceOption label="Цена за поездку" value={car.pricing.transfer} isSelected={selectedTariff?.serviceType === 'Трансфер'} onClick={() => handleTariffSelect({ serviceType: 'Трансфер', duration: 'Поездка', price: car.pricing.transfer! })} />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6">
                <button
                  onClick={handlePrimaryBookAction}
                  disabled={!selectedTariff}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#d4af37] text-black rounded-lg text-base sm:text-lg font-bold
                             hover:bg-[#c0982c] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50
                             transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl
                             transform hover:-translate-y-0.5 active:translate-y-0
                             disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <CheckCircleIcon className="h-6 w-6" />
                  <span>{selectedTariff ? <>Забронировать за <FormattedPrice value={selectedTariff.price} /> ₸</> : 'Выберите тариф'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && selectedTariff && (
        <BookingModal
          isOpen={true}
          onClose={() => setShowBookingModal(false)}
          carName={car.name}
          bookingDetails={selectedTariff}
        />
      )}
    </>
  )
}