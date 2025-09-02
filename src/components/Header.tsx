// src/components/Header.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import NavLink from '@/components/ui/NavLink';
import NavButton from '@/components/ui/NavButton';
import MobileNavLink from '@/components/MobileNavLink';
import MobileActionButton from '@/components/MobileActionButton';
import LoginModal from './LoginModal';
import CalculatorModal from './CalculatorModal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Menu, X, User, Download, Calculator, MessageSquare, LogOut, Loader2 } from 'lucide-react';

// GTM helper for click analytics
const pushEvent = (event: string, payload: Record<string, any> = {}) => {
  try {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push({ event, ...payload });
  } catch (e) {
    // noop
  }
};

const menuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      when: "beforeChildren",
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
};

const ctaButtonVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } },
};

const navItems = [
  { href: "/autopark", label: "Автопарк" },
  { href: "/services", label: "Услуги" },
  { href: "/contacts", label: "Контакты" },
  { href: "/terms", label: "Условия аренды" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useScrollLock(isMenuOpen || showLoginModal || showCalcModal);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setShowLoginModal(false);
        setShowCalcModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (focusableElements[0]) (focusableElements[0] as HTMLElement).focus();
    }
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const handleAction = useCallback((action: () => void) => {
    setIsMenuOpen(false);
    action();
  }, []);
  const handleLogin = useCallback(() => handleAction(() => setShowLoginModal(true)), [handleAction]);
  const openCalcModal = useCallback(() => handleAction(() => setShowCalcModal(true)), [handleAction]);
  const handleLogout = useCallback(() => handleAction(signOut), [handleAction, signOut]);

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          isMounted && (isScrolled || isMenuOpen)
            ? 'bg-background/80 backdrop-blur-lg border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-20 relative">
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
              <NavButton onClick={() => setShowCalcModal(true)} title="Калькулятор аренды">
                <Calculator size={22} />
              </NavButton>
              {isMounted && !isLoading ? (
                user ? (
                  <>
                    <NavButton href="/dashboard" title="Личный кабинет">
                      <User size={22} />
                    </NavButton>
                    <NavButton onClick={signOut} title="Выйти">
                      <LogOut size={22} />
                    </NavButton>
                  </>
                ) : (
                  <NavButton onClick={() => setShowLoginModal(true)} title="Войти в личный кабинет">
                    <User size={22} />
                  </NavButton>
                )
              ) : (
                <div className="p-2 w-[88px] h-[40px] flex justify-center items-center">
                  <Loader2 size={22} className="animate-spin text-muted-foreground" />
                </div>
              )}
              <NavButton href="/download" title="Скачать приложение">
                <Download size={22} />
              </NavButton>
            </div>

            <button
              className="p-2 lg:hidden text-foreground hover:text-brand-accent transition-colors z-50"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-heading"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg overflow-y-auto lg:hidden"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-foreground p-2"
              aria-label="Закрыть меню"
            >
              <X size={28} />
            </button>

            <div className="container mx-auto flex flex-col p-4 pt-20 min-h-screen">
              <div className="flex flex-col gap-1 pb-3">
                <motion.h2
                  variants={menuItemVariants}
                  id="menu-heading"
                  className="px-3 pt-1 pb-2 text-sm font-semibold text-muted-foreground"
                >
                  Навигация
                </motion.h2>
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <MobileNavLink href={item.href} currentPath={pathname} onClick={toggleMenu}>
                      {item.label}
                    </MobileNavLink>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border/50" />

              <div className="flex flex-col gap-1 py-3">
                <motion.h2
                  variants={menuItemVariants}
                  className="px-3 pt-1 pb-2 text-sm font-semibold text-muted-foreground"
                >
                  Аккаунт
                </motion.h2>
                {isLoading ? (
                  <motion.div variants={menuItemVariants}>
                    <MobileActionButton disabled>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Загрузка...</span>
                    </MobileActionButton>
                  </motion.div>
                ) : user ? (
                  <>
                    <motion.div variants={menuItemVariants}>
                      <MobileNavLink href="/dashboard" currentPath={pathname} onClick={toggleMenu}>
                        <User size={20} />
                        <span>Личный кабинет</span>
                      </MobileNavLink>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <MobileActionButton onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Выйти</span>
                      </MobileActionButton>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={menuItemVariants}>
                    <MobileActionButton onClick={handleLogin}>
                      <User size={20} />
                      <span>Войти / Регистрация</span>
                    </MobileActionButton>
                  </motion.div>
                )}
              </div>

              <div className="border-t border-border/50" />

              <div className="flex flex-col gap-1 pt-3">
                <motion.div variants={menuItemVariants}>
                  <MobileActionButton onClick={openCalcModal}>
                    <Calculator size={20} />
                    <span>Калькулятор</span>
                  </MobileActionButton>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <MobileNavLink href="/download" currentPath={pathname} onClick={toggleMenu}>
                    <Download size={20} />
                    <span>Скачать приложение</span>
                  </MobileNavLink>
                </motion.div>
              </div>

              <motion.div className="mt-6 mb-2" variants={ctaButtonVariants}>
                <a
                  href="https://wa.me/77776660295"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-brand-accent text-background font-semibold py-3.5 rounded-lg hover:bg-brand-accent-hover active:scale-95 transition-all duration-150"
                  onClick={() => pushEvent('contact_click', { channel: 'whatsapp', label: 'wa.me/77776660295', location: 'header_mobile_cta' })}
                >
                  <MessageSquare size={20} />
                  <span>Написать в WhatsApp</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <CalculatorModal isOpen={showCalcModal} onClose={() => setShowCalcModal(false)} />
    </>
  );
}
