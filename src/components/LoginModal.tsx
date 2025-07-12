// src/components/LoginModal.tsx
'use client'

import { useState, ChangeEvent } from 'react'

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


type Props = {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    const cleanedPhone = phone.replace(/[^\d]/g, '');
    
    const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignup ? { name, email, phone: cleanedPhone, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Произошла неизвестная ошибка');
      }
      
      localStorage.setItem('topcar-user', JSON.stringify(data.user));
      window.location.reload();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-black border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">
          {isSignup ? 'Регистрация в TopCar' : 'Вход в TopCar'}
        </h2>

        <div className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Имя"
              className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isSignup && (
            <input
              type="tel"
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 transition"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={18}
            />
          )}
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-white text-black py-3 rounded-full font-semibold tracking-wide hover:bg-white/90 transition"
        >
          {loading
            ? isSignup
              ? 'Регистрация...'
              : 'Вход...'
            : isSignup
            ? 'Зарегистрироваться'
            : 'Продолжить'}
        </button>

        <p className="mt-4 text-sm text-white/60 text-center">
          {isSignup ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
          <button
            className="underline hover:text-white transition"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
          >
            {isSignup ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-white/60 hover:underline block text-center w-full"
        >
          Отмена
        </button>
      </div>
    </div>
    )
  }