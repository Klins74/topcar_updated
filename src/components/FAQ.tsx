// src/components/FAQ.tsx
'use client'

import FadeInWhenVisible from './FadeInWhenVisible'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// More structured FAQ data
const faqData = [
  {
    question: 'Оплата и депозиты',
    answer:
      'Мы принимаем к оплате банковские карты Visa, MasterCard, а также наличные. Депозит зависит от класса автомобиля и периода аренды. Вся информация о депозите будет предоставлена вам до подтверждения бронирования. Возврат депозита осуществляется в течение 1-3 рабочих дней после возврата авто при отсутствии повреждений.',
  },
  {
    question: 'Условия аренды',
    answer:
      'Минимальный возраст водителя — 23 года, минимальный стаж вождения — 3 года. Для некоторых автомобилей премиум-класса могут действовать повышенные требования. Необходимые документы: паспорт, водительское удостоверение. Международное ВУ потребуется для иностранных граждан. Все автомобили застрахованы.',
  },
  {
    question: 'Возврат авто',
    answer:
      'Автомобиль должен быть возвращен в указанное в договоре время и место, с тем же уровнем топлива, что и при получении, и в чистом виде. Возможен возврат в другом месте или внерабочее время по предварительному согласованию и за дополнительную плату. Мы ценим ваше время и стремимся сделать процесс возврата максимально быстрым и удобным.',
  },
  {
    question: 'Можно ли выезжать за пределы города/страны?',
    answer:
      'Выезд за пределы города Алматы возможен по предварительному согласованию. Для выезда за пределы Республики Казахстан действуют особые условия и тарифы, которые необходимо уточнить у нашего менеджера при бронировании. Мы поможем подобрать оптимальный вариант для вашего путешествия.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 bg-neutral-950"> {/* Darker section bg */}
      <div className="max-w-4xl mx-auto">
        <FadeInWhenVisible>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-16 sm:mb-20 text-center tracking-tight text-white">
            Частые <span className="text-[#d4af37]">вопросы</span>
            <span className="block w-24 h-1 bg-[#d4af37] mx-auto mt-4"></span>
          </h2>
        </FadeInWhenVisible>

        <div className="space-y-5"> {/* Increased spacing between FAQ items */}
          {faqData.map((item, idx) => (
            <FadeInWhenVisible key={idx} delay={idx * 0.05}> {/* Slightly reduced delay for quicker succession */}
              <details className="group bg-neutral-900 border border-neutral-700/70 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:border-[#d4af37]/50">
                <summary 
                  className="flex justify-between items-center p-6 cursor-pointer list-none group-hover:bg-neutral-800/50 rounded-t-xl transition-colors"
                >
                  <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                    {item.question}
                  </span>
                  <ChevronDownIcon className="h-6 w-6 text-neutral-400 group-hover:text-[#d4af37] transition-transform duration-300 ease-in-out group-open:rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-sm sm:text-base text-neutral-300 leading-relaxed opacity-0 max-h-0 group-open:opacity-100 group-open:max-h-screen group-open:pt-2 transition-all duration-500 ease-in-out">
                  {/* Using whitespace-pre-line to respect newlines in answer strings if any */}
                  <p className="whitespace-pre-line">{item.answer}</p>
                </div>
              </details>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  )
}
