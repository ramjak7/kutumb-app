"use client";
import { APP_CONFIG } from '@/config/app.config';
import { useLanguage } from '@/modules/language/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-100 to-white">
      <img src="/logo.png" alt={`${APP_CONFIG.appName} Logo`} className="w-32 h-32 mb-6" />
      <h1 className="text-4xl font-bold text-orange-700 mb-2">{APP_CONFIG.appName}</h1>
      <p className="text-lg text-gray-700 mb-4">{t('public.home.tagline')}</p>
      <div className="flex gap-4 mt-4">
        <a href="/donate" className="px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition">{t('actions.donate')}</a>
        <a href="/program" className="px-6 py-2 bg-white border border-orange-400 text-orange-700 rounded shadow hover:bg-orange-50 transition">{t('actions.viewProgram')}</a>
      </div>
    </main>
  );
}
