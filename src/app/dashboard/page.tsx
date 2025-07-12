// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper'
import FadeInWhenVisible from '@/components/FadeInWhenVisible'
import LoginModal from '@/components/LoginModal';
import {
  UserCircleIcon,
  PhoneIcon as PhoneSolidIcon,
  EnvelopeIcon as EnvelopeSolidIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightOnRectangleIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { type User, type Booking } from '@/types'; // <-- ИСПРАВЛЕНИЕ: Типы импортированы

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch (err) { 
    console.error("Date formatting error:", err);
    return "N/A";
  }
}
const formatDateTime = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch(err) { 
        console.error("DateTime formatting error:", err);
        return "N/A";
    }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at_desc')
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false);

  const router = useRouter()

  const fetchBookings = useCallback(async (phone?: string) => {
    setIsLoadingBookings(true)
    setError(null)
    const supabase = getSupabase()
    let query = supabase.from('bookings').select('*')

    if (adminUser) {
        // Admin sees all
    } else if (phone) {
        query = query.eq('user_phone', phone);
    } else { 
        setIsLoadingBookings(false);
        setBookings([]);
        return;
    }

    if (sortBy === 'created_at_desc') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'created_at_asc') {
      query = query.order('created_at', { ascending: true })
    } else if (sortBy === 'date_from_desc') {
      query = query.order('date_from', { ascending: false })
    } else if (sortBy === 'date_from_asc') {
      query = query.order('date_from', { ascending: true })
    }
    
    const { data, error: dbError } = await query

    if (dbError) {
      console.error('Booking fetch error:', dbError)
      setError('Не удалось загрузить бронирования.')
    } else if (data) {
      setBookings(data as Booking[])
    }
    setIsLoadingBookings(false)
  }, [adminUser, sortBy]);

  useEffect(() => {
    const storedUser = localStorage.getItem('topcar-user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        if (parsedUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          setAdminUser(parsedUser)
          fetchBookings() 
        } else {
          fetchBookings(parsedUser.phone); 
        }
      } catch (err) { 
        console.error("Error parsing user from localStorage", err)
        localStorage.removeItem('topcar-user');
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [router, fetchBookings]); 

  const handleDeleteBooking = async (id: string) => {
    if (!adminUser) {
        alert("У вас нет прав для удаления этого бронирования.");
        return;
    }
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) return;
    const supabase = getSupabase()
    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id)
    if (deleteError) {
      alert('Ошибка при удалении бронирования.')
    } else {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('topcar-user');
    setUser(null);
    setAdminUser(null);
    router.push('/');
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking =>
      booking.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.user_name && booking.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.user_phone.includes(searchTerm) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const getCarImagePath = (carName: string, carImageUrl?: string) => {
    if (carImageUrl) return carImageUrl;
    const formattedName = carName.toLowerCase().replace(/mercedes-benz /g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '');
    if (formattedName.includes('g63')) return '/cars/g63.jpg';
    if (formattedName.includes('w223') || formattedName.includes('s580')) return '/cars/w223.jpg';
    return `/cars/placeholder-car.png`;
  }

  if (!user && !adminUser && typeof window !== 'undefined' && !localStorage.getItem('topcar-user')) { 
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <ArrowPathIcon className="h-12 w-12 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  const PageHeader = adminUser ? (
    <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-700/80 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Cog6ToothIcon className="h-7 w-7 text-[#d4af37] mr-2"/>
            <h1 className="text-xl font-bold text-white">TopCar Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            title="Выйти"
            className="flex items-center text-sm text-neutral-400 hover:text-[#d4af37] transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1.5" />
            Выйти
          </button>
        </div>
      </div>
    </header>
  ) : (
    <Header onLoginClick={() => setShowLoginModal(true)} />
  );

  return (
    <AnimatedPageWrapper>
      {PageHeader}
      {showLoginModal && !adminUser && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <main className="min-h-screen bg-neutral-950 text-white font-sans pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <FadeInWhenVisible>
          <div className="max-w-7xl mx-auto mb-12 sm:mb-16 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {adminUser ? "Управление " : "Добро пожаловать, "} 
                <span className="text-[#d4af37]">{adminUser ? "Бронированиями" : (user?.name || user?.phone)}</span>
                {adminUser ? "" : "!"}
              </h1>
              <p className="mt-2 text-lg text-neutral-400">
                {adminUser ? "Обзор всех активных и прошлых бронирований." : "Ваш личный кабинет TopCar."}
              </p>
            </div>
            <button
              onClick={() => router.push('/#car-catalog')}
              className="group shrink-0 inline-flex items-center justify-center px-6 py-3 bg-[#d4af37] text-black rounded-lg text-sm sm:text-base font-semibold
                         hover:bg-[#c0982c] transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-[#d4af37]/50 shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Новое бронирование
            </button>
          </div>
        </FadeInWhenVisible>

        {(adminUser || user) && ( 
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
                <FadeInWhenVisible className="lg:col-span-1"> 
                <section className="bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 h-full">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <UserCircleIcon className="h-8 w-8 text-[#d4af37] mr-3" />
                        Профиль {adminUser ? "Администратора" : "Пользователя"}
                    </h2>
                    {!adminUser && user && ( 
                        <button 
                            onClick={handleLogout}
                            title="Выйти"
                            className="p-2 text-neutral-500 hover:text-red-400 transition-colors rounded-full hover:bg-neutral-800"
                        >
                            <ArrowRightOnRectangleIcon className="h-6 w-6"/>
                        </button>
                    )}
                    </div>
                    <div className="space-y-4">
                    {user && <>
                        <div className="flex items-center">
                            <UserCircleIcon className="h-5 w-5 text-neutral-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-neutral-400">Имя:</span>
                            <span className="ml-auto text-sm text-white font-medium">{user.name || 'Не указано'}</span>
                        </div>
                        <div className="flex items-center">
                            <PhoneSolidIcon className="h-5 w-5 text-neutral-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-neutral-400">Телефон:</span>
                            <span className="ml-auto text-sm text-white font-medium">{user.phone}</span>
                        </div>
                        <div className="flex items-center">
                            <EnvelopeSolidIcon className="h-5 w-5 text-neutral-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-neutral-400">Email:</span>
                            <span className="ml-auto text-sm text-white font-medium">{user.email || 'Не указан'}</span>
                        </div>
                    </>}
                    </div>
                </section>
                </FadeInWhenVisible>
            </div>
        )}

        <FadeInWhenVisible className="max-w-7xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div className="relative sm:col-span-2 md:col-span-1">
                <label htmlFor="searchTerm" className="block text-xs font-medium text-neutral-400 mb-1">Поиск по бронированиям</label>
                <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                    type="text"
                    id="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ID, Имя, Телефон, Авто..."
                    className="w-full pl-10 pr-3 py-2.5 text-sm text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                />
                </div>
            </div>
            <div>
                <label htmlFor="sortBy" className="block text-xs font-medium text-neutral-400 mb-1">Сортировать по</label>
                <div className="relative">
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); fetchBookings(adminUser ? undefined : user?.phone); }}
                    className="w-full pl-3 pr-10 py-2.5 text-sm text-white bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none"
                >
                    <option value="created_at_desc">Новые сначала (по созданию)</option>
                    <option value="created_at_asc">Старые сначала (по созданию)</option>
                    <option value="date_from_desc">Новые сначала (по дате аренды)</option>
                    <option value="date_from_asc">Старые сначала (по дате аренды)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                    <FunnelIcon className="h-4 w-4" />
                </div>
                </div>
            </div>
            </div>
        </FadeInWhenVisible>

        <div className="max-w-7xl mx-auto">
            {isLoadingBookings ? (
            <div className="text-center py-20">
                <ArrowPathIcon className="h-12 w-12 text-[#d4af37] animate-spin mx-auto" />
                <p className="mt-4 text-neutral-400">Загрузка ваших бронирований...</p>
            </div>
            ) : error ? (
            <div className="text-center py-20 px-6 bg-red-900/20 border border-red-700/50 rounded-lg">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-red-300 mb-1">Ошибка загрузки</p>
                <p className="text-sm text-red-400">{error}</p>
                <button 
                    onClick={() => fetchBookings(adminUser ? undefined : user?.phone)}
                    className="mt-6 px-5 py-2 bg-[#d4af37] text-black text-sm font-semibold rounded-md hover:bg-[#c0982c] transition-colors"
                >
                    Попробовать снова
                </button>
            </div>
            ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 px-6 bg-neutral-800/30 border border-neutral-700 rounded-lg">
                <NoSymbolIcon className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-neutral-300 mb-2">
                {searchTerm ? "Бронирования не найдены" : "У вас пока нет бронирований"}
                </p>
                <p className="text-neutral-400">
                {searchTerm ? "По вашему запросу ничего не найдено." : "Ваши активные и прошлые бронирования будут отображены здесь."}
                </p>
            </div>
            ) : (
            <ul className="space-y-6">
                {filteredBookings.map((b) => (
                <li
                    key={b.id}
                    className="bg-neutral-800/60 border border-neutral-700/70 rounded-xl shadow-lg 
                                 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-neutral-600"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 p-4 sm:p-5 items-center">
                    <div className="md:col-span-2 aspect-video sm:aspect-square md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-700/50">
                        <Image
                        src={getCarImagePath(b.car_name, b.car_image_url)}
                        alt={b.car_name}
                        fill
                        className="object-cover"
                        onError={(imgEvent) => { (imgEvent.target as HTMLImageElement).src = '/cars/placeholder-car.png'; }}
                        />
                    </div>
                    <div className="md:col-span-5 space-y-1.5">
                        <h3 className="text-lg font-semibold text-white leading-tight">{b.car_name}</h3>
                        <p className="text-sm text-neutral-300 flex items-center">
                        <UserCircleIcon className="h-4 w-4 mr-2 text-[#d4af37]/80 flex-shrink-0" />
                        {b.user_name || 'Имя не указано'}
                        </p>
                        <p className="text-sm text-neutral-300 flex items-center">
                        <PhoneSolidIcon className="h-4 w-4 mr-2 text-[#d4af37]/80 flex-shrink-0" />
                        {b.user_phone}
                        </p>
                        <p className="text-sm text-neutral-300 flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2 text-[#d4af37]/80 flex-shrink-0" />
                        {formatDate(b.date_from)} - {formatDate(b.date_to)}
                        </p>
                    </div>
                    <div className="md:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                        <div className="p-2 bg-neutral-900 rounded-md border border-neutral-700">
                        <QRCodeCanvas
                            value={JSON.stringify({ bookingId: b.id, car: b.car_name, client: b.user_phone })}
                            size={64}
                            bgColor="transparent"
                            fgColor="#FFFFFF"
                            level="M"
                            className="rounded-sm"
                        />
                        </div>
                        <p className="text-xs text-neutral-500 flex items-center mt-1">
                        <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        Создано: {formatDateTime(b.created_at)}
                        </p>
                    </div>
                    {adminUser && (
                        <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-2 items-stretch md:items-end justify-center md:justify-end">
                        <button
                            onClick={() => handleDeleteBooking(b.id)}
                            title="Удалить бронирование"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-400 bg-red-900/30 hover:bg-red-800/50 border border-red-700/50 hover:border-red-600 rounded-md transition-colors w-full md:w-auto"
                        >
                            <TrashIcon className="h-4 w-4" />
                            Удалить
                        </button>
                        </div>
                    )}
                    </div>
                </li>
                ))}
            </ul>
            )}
        </div>
      </main>
      {!adminUser && <Footer />}
    </AnimatedPageWrapper>
  )
}
