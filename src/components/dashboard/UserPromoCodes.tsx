// Файл: src/components/dashboard/UserPromoCodes.tsx

'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon, ExclamationTriangleIcon, TicketIcon, TagIcon } from '@heroicons/react/24/outline';

// Описываем тип данных для промокода
interface PromoCode {
  id: number;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  // Можно добавить и другие поля, например, дату истечения
  // expiry_date: string; 
}

export default function UserPromoCodes() {
  const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPromoCodes = async () => {
      setStatus('loading');
      try {
        const response = await fetch('/api/user/promocodes');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Не удалось загрузить данные.');
        }
        const data = await response.json();
        setPromocodes(data);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message);
      }
    };
    fetchPromoCodes();
  }, []);

  // Состояние загрузки
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center text-neutral-500 h-40">
        <ArrowPathIcon className="h-6 w-6 animate-spin mr-3" />
        <span>Загружаем промокоды...</span>
      </div>
    );
  }

  // Состояние ошибки
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center text-red-400 h-40 bg-red-900/20 rounded-lg p-4">
        <ExclamationTriangleIcon className="h-8 w-8 mb-2" />
        <p className="font-semibold">Ошибка</p>
        <p className="text-sm text-red-400/80">{errorMessage}</p>
      </div>
    );
  }

  // Основной рендер
  return (
    <section>
      <div className="flex items-center mb-6">
          <TagIcon className="h-8 w-8 text-[#d4af37] mr-3 shrink-0" />
          <h2 className="text-2xl font-bold text-white">Ваши промокоды</h2>
      </div>
      {promocodes.length > 0 ? (
        <ul className="space-y-4">
          {promocodes.map((promo) => (
            <li 
              key={promo.id} 
              className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-5 flex items-center justify-between transition-colors hover:border-neutral-600"
            >
              <div className="flex items-center">
                <div className="bg-neutral-700/50 p-3 rounded-lg mr-4">
                    <TicketIcon className="h-6 w-6 text-[#d4af37]"/>
                </div>
                <div>
                  <p className="font-mono text-lg text-white tracking-widest">{promo.code}</p>
                  <p className="text-sm text-neutral-400">Скидка {promo.discount_percentage}%</p>
                </div>
              </div>
              <span 
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  promo.is_active 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-neutral-700 text-neutral-400 border border-neutral-600'
                }`}
              >
                {promo.is_active ? 'Активен' : 'Использован'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 px-6 bg-neutral-800/30 border border-dashed border-neutral-700 rounded-lg">
            <p className="text-neutral-400">У вас пока нет доступных промокодов.</p>
        </div>
      )}
    </section>
  );
}