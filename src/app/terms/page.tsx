// src/app/terms/page.tsx
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'
import FadeInWhenVisible from '@/components/FadeInWhenVisible'
import LoginModal from '@/components/LoginModal';
import { ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

type TermSection = {
  title: string;
  content: string[];
};

const termsData: TermSection[] = [
  {
    title: '1. Общие положения',
    content: [
      'Аренда автомобиля осуществляется исключительно при предъявлении Арендатором действующего водительского удостоверения соответствующей категории и паспорта (или иного документа, удостоверяющего личность).',
      'Минимальный возраст Арендатора для большинства автомобилей составляет 23 года. Минимальный стаж вождения – 3 года. Для автомобилей классов "Премиум" и "Люкс" могут применяться повышенные возрастные и стажевые требования, которые оговариваются индивидуально.',
      'Компания TopCar оставляет за собой право отказать в предоставлении автомобиля без объяснения причин.',
    ],
  },
  {
    title: '2. Срок аренды и возврат автомобиля',
    content: [
      'Минимальный срок аренды автомобиля составляет 24 (двадцать четыре) часа с момента его получения. При аренде на меньший срок оплата взимается как за полные сутки.',
      'Возврат автомобиля должен быть осуществлен строго в дату, время и место, указанные в договоре аренды. Задержка возврата автомобиля без предварительного согласования с представителем TopCar влечет за собой штрафные санкции.',
      'Автомобиль должен быть возвращен в чистом виде (кузов и салон) и с тем же уровнем топлива, который был зафиксирован на момент начала аренды. В противном случае, Арендатор возмещает расходы на мойку и/или дозаправку согласно тарифам Компании.',
    ],
  },
  {
    title: '3. Залог и оплата',
    content: [
      'Перед началом аренды Арендатор вносит гарантийный депозит (залог), размер которого зависит от класса выбранного автомобиля и указывается в договоре аренды.',
      'Залог возвращается Арендатору в полном объеме после возврата автомобиля, его осмотра представителем TopCar и при условии отсутствия повреждений автомобиля, штрафов за нарушение ПДД и выполнения всех прочих условий договора.',
      'Оплата полной стоимости аренды производится Арендатором до начала периода аренды. Возможные способы оплаты: наличными, банковской картой (Visa, MasterCard), банковским переводом.',
    ],
  },
  {
    title: '4. Страховка и ответственность',
    content: [
      'Все автомобили TopCar застрахованы по программам ОСАГО и КАСКО с определенными условиями франшизы (ответственности Арендатора).',
      'В случае дорожно-транспортного происшествия (ДТП), повреждения или угона автомобиля, Арендатор обязан незамедлительно уведомить об этом представителей TopCar по указанным в договоре телефонам, а также компетентные органы (дорожную полицию, службу спасения и т.д.) и оформить все необходимые документы.',
      'Арендатор несет полную материальную ответственность за ущерб, причиненный автомобилю или третьим лицам, в случаях, не покрываемых страховым полисом, или при нарушении условий договора аренды (например, управление в состоянии алкогольного/наркотического опьянения, передача управления третьему лицу без согласования и т.д.).',
    ],
  },
  {
    title: '5. Ограничения по пробегу и территории эксплуатации',
    content: [
      'Стандартный суточный лимит пробега составляет 300 км. Превышение данного лимита оплачивается дополнительно согласно тарифам, указанным в договоре.',
      'Эксплуатация автомобиля разрешена в пределах города Алматы и Алматинской области. Выезд за пределы указанной территории возможен только по предварительному письменному согласованию с TopCar и может потребовать дополнительной оплаты или увеличения залоговой суммы.',
    ],
  },
  {
    title: '6. Дополнительные услуги и оборудование',
    content: [
      'TopCar предлагает ряд дополнительных услуг: аренда с персональным водителем, трансфер из/в аэропорт или ж/д вокзал, установка детского автомобильного кресла, предоставление GPS-навигатора и другого оборудования.',
      'Все дополнительные услуги и оборудование заказываются и оплачиваются отдельно. Пожалуйста, информируйте о необходимости таких услуг заранее при бронировании автомобиля.',
    ],
  },
];

export default function TermsPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <AnimatedPageWrapper>
      <Header onLoginClick={() => setShowLoginModal(true)} />
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <main className="min-h-screen bg-neutral-950 text-white font-sans">
        {/* Page Hero/Title Section */}
        <section className="relative py-20 sm:py-28 md:py-32 text-center bg-gradient-to-b from-black via-neutral-900 to-neutral-950 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/patterns/subtle-legal.svg')] bg-repeat"></div> {/* Ensure this SVG exists or remove */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <FadeInWhenVisible>
              <DocumentTextIcon className="h-16 w-16 text-[#d4af37] mx-auto mb-6 opacity-80" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                Условия <span className="text-[#d4af37]">Аренды TopCar</span>
              </h1>
              <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                Пожалуйста, внимательно ознакомьтесь с нашими условиями предоставления автомобилей в аренду. Мы ценим вашу безопасность и стремимся к максимальной прозрачности.
              </p>
              <span className="block w-20 h-0.5 bg-[#d4af37]/40 mx-auto mt-8"></span>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Terms Content Section */}
        <section id="terms-content" className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <FadeInWhenVisible>
              <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-10">
                {termsData.map((section, idx) => (
                  <FadeInWhenVisible key={idx} delay={idx * 0.05} className="border-b border-neutral-700/50 pb-8 last:border-b-0 last:pb-0">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-5 flex items-center">
                      <ShieldCheckIcon className="h-7 w-7 text-[#d4af37] mr-3 flex-shrink-0" />
                      {section.title}
                    </h2>
                    <div className="space-y-3 text-sm sm:text-base text-neutral-300 leading-relaxed sm:leading-loose">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>

      <Footer />
    </AnimatedPageWrapper>
  )
}
