'use client'

import { useState, ChangeEvent } from 'react';
import { formatPhoneNumber } from '@/lib/formatters'; // <-- 1. Импортируем из общего файла
import InputField from '@/components/ui/InputField';  // <-- 2. Импортируем наш новый компонент

type Props = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: Props) {
  const [isSignup, setIsSignup] = useState(false);
  
  // 3. Используем единый объект для всех данных формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 4. Универсальный обработчик для всех полей
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Для телефона используем форматирование
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы
    setLoading(true);
    setError('');

    const cleanedPhone = formData.phone.replace(/[^\d]/g, '');
    const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignup 
      ? { name: formData.name, email: formData.email, phone: cleanedPhone, password: formData.password } 
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-black border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 tracking-tight text-white">
          {isSignup ? 'Регистрация в TopCar' : 'Вход в TopCar'}
        </h2>

        {/* 5. Используем наш новый InputField, код стал намного чище! */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <InputField
              label="Имя"
              name="name"
              type="text"
              placeholder="Как к вам обращаться"
              value={formData.name}
              onChange={handleChange}
            />
          )}
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="example@mail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {isSignup && (
            <InputField
              label="Телефон"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handleChange}
            />
          )}
          <InputField
            label="Пароль"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className="text-red-400 text-sm pt-2">{error}</p>}

          <button
            type="submit" // Важно указать type="submit" для формы
            disabled={loading}
            className="w-full mt-6 bg-white text-black py-3 rounded-full font-semibold tracking-wide hover:bg-white/90 transition disabled:opacity-50"
          >
            {loading ? (isSignup ? 'Регистрация...' : 'Вход...') : (isSignup ? 'Зарегистрироваться' : 'Продолжить')}
          </button>
        </form>

        <div className="mt-4 text-center">
             <p className="text-sm text-white/60">
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
                className="mt-3 text-sm text-white/60 hover:underline"
            >
                Отмена
            </button>
        </div>

      </div>
    </div>
  );
}