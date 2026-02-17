
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const en = require('../../../locales/en.json');
const hi = require('../../../locales/hi.json');

export type SupportedLanguage = 'en' | 'hi';

const translations = { en, hi };

interface LanguageContextProps {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

// 1. Initialize the context with a dummy 't' function instead of undefined
// This prevents the "Attempted to call useLanguage on server" crash during static gen
const LanguageContext = createContext<LanguageContextProps>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key, 
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<SupportedLanguage>('en');

  function t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === 'string' ? value : key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
