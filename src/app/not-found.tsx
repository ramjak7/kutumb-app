"use client";
import { useLanguage } from '@/modules/language/LanguageProvider';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // While rendering on the server during build, show a generic fallback
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-orange-700 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-orange-700 mb-4">
        {t('errors.notFound') || 'Page Not Found'}
      </h1>
      <p className="text-gray-600 mb-8">
        {t('errors.notFoundMessage') || 'Sorry, the page you are looking for does not exist.'}
      </p>
      <a href="/" className="px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition">
        Go Home
      </a>
    </div>
  );
}