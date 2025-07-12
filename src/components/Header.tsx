// src/components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bars3Icon,
  XMarkIcon,
  ArrowDownTrayIcon,
  UserIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import LoginModal from './LoginModal'
import CalculatorModal from './CalculatorModal'

export interface HeaderProps {
  onLoginClick?: () => void
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isModalOpen = mobileOpen || showLoginModal || showCalcModal;
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, showLoginModal, showCalcModal]);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setShowLoginModal(true);
    }
  };
  
  const handleCalcClick = () => {
    setShowCalcModal(true);
  };


  const navItems = [
    { href: "/autopark", label: "Автопарк" },
    { href: "/services", label: "Услуги" },
    { href: "/contacts", label: "Контакты" },
    { href: "/terms", label: "Условия аренды" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out 
                   ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
          {/* --- Левая колонка --- */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-3" aria-label="TopCar Home">
              <Image
                src="/logo.png"
                alt="TopCar Logo"
                width={40}
                height={40}
                className="h-9 w-9 sm:h-10 sm:w-10"
                priority
              />
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                TOPCAR
              </span>
            </Link>
          </div>
          
          {/* --- Центральная колонка (только на десктопе) --- */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                   <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground-dark hover:text-accent transition-colors">
                      {item.label}
                   </Link>
              ))}
            </nav>
          </div>

          {/* --- Правая колонка --- */}
          <div className="flex-1 flex justify-end items-center">
            <div className="hidden lg:flex items-center gap-2">
                <button onClick={handleCalcClick} aria-label="Рассчитать стоимость" title="Рассчитать стоимость" className="p-2.5 text-foreground-dark hover:text-accent transition-colors">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </button>
                <button onClick={handleLoginClick} aria-label="Войти или профиль" title="Войти или профиль" className="p-2.5 text-foreground-dark hover:text-accent transition-colors">
                  <UserIcon className="h-6 w-6" />
                </button>
                 <Link href="/download" aria-label="Установить приложение" title="Установить приложение" className="p-2.5 text-foreground-dark hover:text-accent transition-colors">
                  <ArrowDownTrayIcon className="h-6 w-6" />
                </Link>
            </div>
            
            <button
              className="p-2 text-foreground-dark hover:text-accent lg:hidden"
              aria-label="Открыть меню"
              onClick={() => setMobileOpen(true)}
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Выпадающее мобильное меню */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />
          <nav
            className="relative ml-auto h-full w-4/5 max-w-xs bg-card text-foreground
                           border-l border-border shadow-2xl
                           flex flex-col gap-2 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-accent">Меню</span>
                <button
                  aria-label="Закрыть меню"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-foreground-dark hover:text-foreground"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            {navItems.map(item => (
                <Link 
                    key={item.href}
                    href={item.href}  
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-base text-foreground hover:bg-accent hover:text-black transition-colors duration-200"
                >
                    {item.label}
                </Link>
            ))}
            <div className="mt-auto space-y-4 pt-6 border-t border-border">
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base bg-accent text-black font-semibold
                                   hover:bg-accent-hover transition-colors duration-200"
                  onClick={() => { setMobileOpen(false); handleLoginClick() }}
                >
                    <UserIcon className="h-5 w-5"/>
                    Войти в кабинет
                </button>
                <Link
                  href="/download"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base border border-border text-foreground-dark
                                   hover:bg-neutral-700 hover:text-foreground transition-colors duration-200"
                >
                    <ArrowDownTrayIcon className="h-5 w-5"/>
                    Скачать приложение
                </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Модальные окна */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <CalculatorModal isOpen={showCalcModal} onClose={() => setShowCalcModal(false)} />
    </>
  )
}
