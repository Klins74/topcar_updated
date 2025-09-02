'use client';

import { useState } from 'react';
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { languages } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: 'ru' | 'en' | 'kk') => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600"
        aria-label="Change language"
      >
        <LanguageIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code as 'ru' | 'en' | 'kk')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-neutral-800 transition-colors ${
                  locale === language.code 
                    ? 'bg-neutral-800 text-[#d4af37]' 
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {locale === language.code && (
                  <div className="ml-auto w-2 h-2 bg-[#d4af37] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
