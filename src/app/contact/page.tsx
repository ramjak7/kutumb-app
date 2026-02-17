"use client";
import React from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">{t('public.contact.heading')}</h2>
      <div className="bg-white rounded shadow p-6 mb-8">
        <p className="mb-4 text-gray-700">
          {/* TODO: Add translation key for this message */}
          For questions, suggestions, or to volunteer, please contact the festival committee.
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Email: <a href="mailto:info@kutumbfest.org" className="text-orange-600">info@kutumbfest.org</a></li>
          <li>WhatsApp: <a href="https://wa.me/919999999999" className="text-orange-600">+91-99999-99999</a></li>
        </ul>
      </div>
      <form className="bg-orange-50 rounded shadow p-6 flex flex-col gap-4">
        <label className="font-medium text-gray-700">
          {t('donor.name')}
          <input type="text" name="name" className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <label className="font-medium text-gray-700">
          {/* TODO: Add translation key for 'Message' */}
          Message
          <textarea name="message" rows={4} className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <button type="submit" className="mt-4 px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition">
          {t('actions.send')}
        </button>
      </form>
    </main>
  );
}
