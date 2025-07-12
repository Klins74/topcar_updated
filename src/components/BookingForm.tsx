// src/components/BookingForm.tsx
'use client'

import React, { useState, FormEvent, ChangeEvent } from 'react'
import {
  CalendarDaysIcon,
  UserIcon as UserSolidIcon,
  PhoneIcon as PhoneSolidIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/20/solid'

// --- Вспомогательная функция, добавленная прямо сюда ---
const formatPhoneNumber = (value: string): string => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 1) return '+';
    
    let formattedNumber = '+';
    if (phoneNumber.startsWith('7') || phoneNumber.startsWith('8')) {
      formattedNumber += `7 (${phoneNumber.substring(1, 4)}`;
    } else {
      formattedNumber += `7 (${phoneNumber.substring(0, 3)}`;
    }
  
    if (phoneNumberLength > 4) {
      formattedNumber += `) ${phoneNumber.substring(4, 7)}`;
    }
    if (phoneNumberLength > 7) {
      formattedNumber += `-${phoneNumber.substring(7, 9)}`;
    }
    if (phoneNumberLength > 9) {
      formattedNumber += `-${phoneNumber.substring(9, 11)}`;
    }
  
    return formattedNumber;
};


type HeroIconType = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  title?: string | undefined;
  titleId?: string | undefined;
} & React.RefAttributes<SVGSVGElement>>;

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: HeroIconType;
  required?: boolean;
  min?: string;
  disabled?: boolean;
  maxLength?: number;
}

const InputField = ({ id, label, type = 'text', placeholder, value, onChange, icon: Icon, required = true, min, disabled = false, maxLength }: InputFieldProps) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-1.5">
            {label} {required && <span className="text-[#d4af37]">*</span>}
        </label>
        <div className="relative">
            {Icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Icon className="h-5 w-5 text-neutral-500" />
              </div>
            )}
            <input
                type={type} id={id} name={id} value={value} onChange={onChange}
                placeholder={placeholder} required={required} min={min} disabled={disabled} maxLength={maxLength}
                className={`w-full py-3 ${Icon ? 'pl-10 pr-3' : 'px-3.5'} text-base text-white bg-neutral-800 border border-neutral-700 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] placeholder-neutral-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${type === 'date' && !value ? 'text-neutral-500' : 'text-white'}`}
            />
        </div>
    </div>
);

export default function BookingForm() {
  const [carName, setCarName] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' })

  const today = new Date().toISOString().split('T')[0];
  
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setUserPhone(formatted);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFormStatus({ type: '', message: '' })
    
    const cleanedPhone = userPhone.replace(/[^\d]/g, '');

    if (!carName || !dateFrom || !dateTo || !userName || !cleanedPhone) {
      setFormStatus({ type: 'error', message: 'Пожалуйста, заполните все обязательные поля.' })
      setLoading(false)
      return
    }
    if (new Date(dateFrom) > new Date(dateTo)) {
      setFormStatus({ type: 'error', message: 'Дата окончания не может быть раньше даты начала.'});
      setLoading(false);
      return;
    }

    const submissionData = {
      userName,
      userPhone: cleanedPhone,
      carName,
      bookingDetails: {
        serviceType: 'Общая заявка с сайта',
        duration: `с ${dateFrom} по ${dateTo}`,
        price: 0, 
      },
    };

    try {
        const response = await fetch('/api/create-amo-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Произошла ошибка на сервере.');
        }

        setFormStatus({ type: 'success', message: 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' });
        setCarName('');
        setDateFrom('');
        setDateTo('');
        setUserName('');
        setUserPhone('');
        setTimeout(() => setFormStatus({ type: '', message: '' }), 7000);

    } catch (apiError: unknown) {
        console.error("Ошибка при отправке в amoCRM:", apiError);
        const errorMessage = apiError instanceof Error ? apiError.message : 'Не удалось отправить заявку. Попробуйте позже.';
        setFormStatus({ type: 'error', message: errorMessage });
    }
    
    setLoading(false);
  }

  const CarIconPlaceholder: HeroIconType = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(function CarIconPlaceholder(props, ref) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        ref={ref}
        {...props}
      >
        <path d="M5.334 2.004A2.25 2.25 0 0 0 3 4.254v15.492a2.25 2.25 0 0 0 2.334 2.25h13.332A2.25 2.25 0 0 0 21 19.746V4.254a2.25 2.25 0 0 0-2.334-2.25H5.334ZM4.5 4.254a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v15.492a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V4.254Z" />
      </svg>
    )
  })


  return (
    <section id="booking" className="py-24 sm:py-32 px-4 sm:px-6 bg-neutral-950">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 sm:mb-16 text-center tracking-tight text-white">
          Заявка на <span className="text-[#d4af37]">бронирование</span>
          <span className="block w-24 h-1 bg-[#d4af37] mx-auto mt-4"></span>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 sm:space-y-8 bg-neutral-900 border border-neutral-700 p-6 sm:p-10 rounded-2xl shadow-2xl"
        >
          <InputField
            id="carName"
            label="Автомобиль"
            placeholder="Например: Mercedes-Benz G63 AMG"
            value={carName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCarName(e.target.value)}
            icon={CarIconPlaceholder} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              id="dateFrom"
              label="Дата начала"
              type="date"
              placeholder=""
              value={dateFrom}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
              icon={CalendarDaysIcon}
              min={today}
            />
            <InputField
              id="dateTo"
              label="Дата окончания"
              type="date"
              placeholder=""
              value={dateTo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
              icon={CalendarDaysIcon}
              min={dateFrom || today}
              disabled={!dateFrom}
            />
          </div>

          <InputField
            id="userName"
            label="Ваше имя (ФИО)"
            placeholder="Иван Петров"
            value={userName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
            icon={UserSolidIcon}
          />
          <InputField
            id="userPhone"
            label="Контактный телефон"
            type="tel"
            placeholder="+7 (XXX) XXX-XX-XX"
            value={userPhone}
            onChange={handlePhoneChange}
            icon={PhoneSolidIcon}
            maxLength={18}
          />
          
          {formStatus.message && (
            <div className={`flex items-center gap-2 p-3 rounded-md text-sm mt-1
                ${formStatus.type === 'success' ? 'bg-green-900/30 border border-green-700/50 text-green-300' : ''}
                ${formStatus.type === 'error' ? 'bg-red-900/30 border border-red-700/50 text-red-300' : ''}
            `}>
                {formStatus.type === 'success' && <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />}
                {formStatus.type === 'error' && <XCircleIcon className="h-5 w-5 flex-shrink-0" />}
                <span>{formStatus.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 sm:mt-4 px-8 py-4 bg-[#d4af37] text-black rounded-lg text-base sm:text-lg font-semibold 
                       hover:bg-[#c0982c] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50
                       disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out
                       flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Отправка...</span>
              </>
            ) : (
              <>
                Отправить заявку
                <PaperAirplaneIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}