// src/components/CarCatalog.tsx
import Image from 'next/image'
import Link from 'next/link'
import FadeInWhenVisible from './FadeInWhenVisible'
import { Car } from '@/types'
import FormattedPrice from './FormattedPrice'
import SkeletonCard from './SkeletonCard'
import { NoSymbolIcon } from '@heroicons/react/24/outline'

function CarCard({ car }: { car: Car; }) {
  const basePrice = car.prices?.find(p => !p.with_driver && p.days_from === 24)?.price_per_day || car.price_per_day || 0;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': car.name,
            'image': car.image_url || '/cars/placeholder-car.png',
            'description': car.description,
            'brand': car.brand,
            'offers': {
              '@type': 'Offer',
              'priceCurrency': 'KZT',
              'price': basePrice,
              'availability': 'https://schema.org/InStock',
              'url': `https://topcar.club/cars/${car.slug}`
            }
          })
        }}
      />
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
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <h3 className="text-lg font-bold mb-2">{car.name || 'Название автомобиля'}</h3>
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 sm:line-clamp-4">
            {car.description || 'Превосходный автомобиль для ваших поездок.'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white z-20 group-hover:opacity-0 transition-opacity duration-300">
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
    </>
  )
}

export default function CarCatalog({ cars = [], isLoading = false }: { cars?: Car[]; isLoading?: boolean }) {
  return (
    <section id="car-catalog" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <FadeInWhenVisible>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 sm:mb-12 text-center tracking-tight text-white">
            Наш <span className="text-[#d4af37]">автопарк</span>
            <span className="block w-20 h-0.5 bg-[#d4af37]/50 mx-auto mt-4"></span>
          </h2>
        </FadeInWhenVisible>
        {isLoading ? (
          <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (<SkeletonCard key={index} />))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map(car => (
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
            </div>
          </FadeInWhenVisible>
        )}
      </div>
    </section>
  );
}