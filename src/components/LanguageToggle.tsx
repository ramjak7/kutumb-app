"use client"; // 1. Add this!

import { useLanguage } from '@/modules/language/LanguageProvider';
import { APP_CONFIG } from '@/config/app.config';
import { useEffect, useState } from 'react';

export function LanguageToggle() {
  const [mounted, setMounted] = useState(false);
  
  // Only use the hook if we are safely inside the component logic
  // but we must call it at the top level of the function.
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Return a placeholder or null during server-side pre-rendering
  if (!mounted) {
    return <div className="flex gap-2 items-center opacity-0">...</div>;
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'} font-semibold`}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        className={`px-3 py-1 rounded ${lang === 'hi' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'} font-semibold`}
        onClick={() => setLang('hi')}
      >
        हिंदी
      </button>
    </div>
  );
}

export function FestivalBranding() {
  return (
    <header className="flex items-center gap-4 py-4 px-6 bg-orange-50 border-b border-orange-100">
      <img src="/logo.png" alt={`${APP_CONFIG.appName} Logo`} className="w-12 h-12" />
      <span className="text-2xl font-bold text-orange-700">{APP_CONFIG.appName}</span>
    </header>
  );
}
