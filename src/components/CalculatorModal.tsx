// src/components/CalculatorModal.tsx
'use client'

import { XMarkIcon } from '@heroicons/react/24/outline';
import RentalCalculator from './RentalCalculator';
import { useScrollLock } from '@/hooks/useScrollLock'; // <--- ДОБАВЛЕНО: Импорт нового хука

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: Props) {
  // <--- ДОБАВЛЕНО: Используем хук useScrollLock для управления прокруткой body
  useScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex justify-center items-center px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Калькулятор аренды</h2>
            <button onClick={onClose} aria-label="Закрыть" className="p-2 text-neutral-500 hover:text-white rounded-full hover:bg-neutral-700">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="overflow-y-auto">
            {/* Вставляем наш существующий компонент калькулятора */}
            <RentalCalculator />
        </div>
      </div>
    </div>
  );
}