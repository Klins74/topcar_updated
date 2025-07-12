// src/components/PromoSection.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'
import { DocumentDuplicateIcon, CheckIcon as CheckIconOutline, GiftIcon } from '@heroicons/react/24/outline'

export default function PromoSection() {
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" }); // Загружаем, когда секция почти видна

  // При появлении секции в области видимости, генерируем промокод
  useEffect(() => {
    if (!isInView || promoCode) return;

    const generateCode = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/promo/generate', { method: 'POST' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Не удалось сгенерировать код.');
        }
        const data = await response.json();
        setPromoCode(data.promoCode.code);

      } catch (err: any) {
        setError('Не удалось получить промокод. Попробуйте позже.');
        console.error("Error calling promo generation API:", err);
      } finally {
        setIsLoading(false);
      }
    };

    generateCode();
  }, [isInView, promoCode]);

  const handleCopy = () => {
    if (!promoCode) return;
    navigator.clipboard.writeText(promoCode)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => console.error('Failed to copy text: ', err))
  };

  return (
    <section ref={ref} className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 sm:p-12 text-center">
          <div className="mx-auto bg-[#d4af37]/10 p-3 rounded-full w-fit mb-5">
            <GiftIcon className="h-8 w-8 text-[#d4af37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Получите персональную скидку</h2>
          <p className="mt-3 text-lg text-neutral-400 max-w-2xl mx-auto">
            Сгенерируйте уникальный промокод на скидку 15% для вашей первой аренды в TopCar.
          </p>

          <div className="mt-8">
            {isLoading && <p className="text-lg">Генерация вашего кода...</p>}
            {error && <p className="text-lg text-red-400">{error}</p>}
            {promoCode && (
              <div 
                  className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dashed border-[#d4af37]/50 rounded-lg 
                             bg-neutral-800/50 cursor-pointer group hover:border-[#d4af37]"
                  onClick={handleCopy}
                  title="Нажмите, чтобы скопировать"
              >
                  <span className="text-2xl sm:text-3xl font-bold text-[#d4af37] tracking-widest">
                      {promoCode}
                  </span>
                  {copied ? (
                      <CheckIconOutline className="h-6 w-6 text-green-400" />
                  ) : (
                      <DocumentDuplicateIcon className="h-6 w-6 text-neutral-400 group-hover:text-white" />
                  )}
              </div>
            )}
            {copied && <p className="mt-2 text-xs text-green-400 animate-pulse">Скопировано!</p>}
          </div>
        </div>
      </div>
    </section>
  )
}