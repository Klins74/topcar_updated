'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Download, Calculator, MessageSquare, LogOut, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import NavLink from '@/components/ui/NavLink';
import NavButton from '@/components/ui/NavButton';
import MobileNavLink from '@/components/ui/MobileNavLink';
import MobileActionButton from '@/components/ui/MobileActionButton';

import LoginModal from './LoginModal';
import CalculatorModal from './CalculatorModal';

type HeaderProps = {
  onLoginClick?: () => void;
};

const navItems = [
  { href: "/autopark", label: "Автопарк" },
  { href: "/services", label: "Услуги" },
  { href: "/contacts", label: "Контакты" },
  { href: "/terms", label: "Условия аренды" },
];

export default function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isModalActive = isMenuOpen || showLoginModal || showCalcModal;
    document.body.style.overflow = isModalActive ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen, showLoginModal, showCalcModal]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleLogout = async () => {
    if (isMenuOpen) setIsMenuOpen(false);
    await signOut();
  };

  const handleLogin = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    if (onLoginClick) {
      onLoginClick(); // вызов внешней функции
    } else {
      setShowLoginModal(true); // если внешний не передан
    }
  };

  const openCalcModal = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setShowCalcModal(true);
  };

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled || isMenuOpen ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2" aria-label="TopCar Home">
            <Image src="/logo.png" alt="TopCar Logo" width={40} height={40} priority />
            <span className="text-2xl font-bold text-foreground">TOPCAR</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} currentPath={pathname}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <NavButton onClick={openCalcModal} title="Калькулятор аренды">
                <Calculator size={22} />
              </NavButton>

              {isLoading ? (
                <div className="p-2 w-[88px] h-[40px] flex justify-center items-center">
                    <Loader2 size={22} className="animate-spin text-muted-foreground" />
                </div>
              ) : user ? (
                <>
                  <NavButton href="/dashboard" title="Личный кабинет">
                    <User size={22} />
                  </NavButton>
                  <NavButton onClick={handleLogout} title="Выйти">
                    <LogOut size={22} />
                  </NavButton>
                </>
              ) : (
                <NavButton onClick={handleLogin} title="Войти в личный кабинет">
                  <User size={22} />
                </NavButton>
              )}

              <NavButton href="/download" title="Скачать приложение">
                <Download size={22} />
              </NavButton>
            </div>
            
            <button
              className="p-2 lg:hidden text-foreground hover:text-brand-accent transition-colors z-50"
              onClick={toggleMenu}
              aria-label="Открыть меню"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMenu}
            />
            <motion.nav
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-[100dvh] w-4/5 max-w-sm bg-background border-l border-border z-50 flex flex-col p-6 lg:hidden"
            >
              <span className="text-lg font-semibold text-brand-accent mb-6">Меню</span>
              
              <div className="flex flex-col gap-2">
                {navItems.map(item => (
                  <MobileNavLink key={item.href} href={item.href} currentPath={pathname}>
                    {item.label}
                  </MobileNavLink>
                ))}
              </div>

              <div className="border-t border-border my-6"></div>

              <div className="flex flex-col gap-2">
                {isLoading ? (
                    <MobileActionButton onClick={() => {}}>
                        <Loader2 size={20} className="animate-spin text-muted-foreground" />
                        <span>Загрузка...</span>
                    </MobileActionButton>
                ) : user ? (
                  <>
                    <MobileNavLink href="/dashboard" currentPath={pathname}>
                        <User size={20} />
                        <span>Личный кабинет</span>
                    </MobileNavLink>
                    <MobileActionButton onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Выйти</span>
                    </MobileActionButton>
                  </>
                ) : (
                  <MobileActionButton onClick={handleLogin}>
                    <User size={20} />
                    <span>Войти / Регистрация</span>
                  </MobileActionButton>
                )}

                <MobileActionButton onClick={openCalcModal}>
                  <Calculator size={20} />
                  <span>Калькулятор</span>
                </MobileActionButton>
                <MobileNavLink href="/download" currentPath={pathname}>
                  <Download size={20} />
                  <span>Скачать приложение</span>
                </MobileNavLink>
              </div>

              <div className="mt-auto">
                <a 
                  href="https://wa.me/77776660295"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-brand-accent text-background font-semibold py-3.5 rounded-lg hover:bg-brand-accent-hover transition-colors"
                >
                  <MessageSquare size={20}/>
                  <span>Написать в WhatsApp</span>
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Показываем LoginModal только если не пришел внешний onLoginClick */}
      {showLoginModal && !onLoginClick && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      <CalculatorModal isOpen={showCalcModal} onClose={() => setShowCalcModal(false)} />
    </>
  );
}

// Остальные вспомогательные компоненты (NavLink, NavButton, MobileNavLink, MobileActionButton) — без изменений
