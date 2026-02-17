"use client";
import React from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';
// TODO: Connect to Supabase for dynamic donation info
export default function DonationInfoPage() {
  const { t } = useLanguage();
  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">{t('public.donation.heading')}</h2>
      <div className="bg-white rounded shadow p-6 mb-8">
        <p className="mb-4 text-gray-700">
          {/* TODO: Add translation key for this message */}
          Your support helps us organize and grow the festival. All donations are recorded and receipts are provided.
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>100% transparent, audit-safe ledger</li>
          <li>PDF receipt with QR verification</li>
          <li>Bilingual support (Hindi/English)</li>
        </ul>
      </div>
      <form className="bg-orange-50 rounded shadow p-6 flex flex-col gap-4">
        <label className="font-medium text-gray-700">
          {t('donor.name')}
          <input type="text" name="name" className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <label className="font-medium text-gray-700">
          {t('donor.email')}
          <input type="email" name="email" className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <label className="font-medium text-gray-700">
          {t('donation.amount')}
          <input type="number" name="amount" min="1" className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <button type="submit" className="mt-4 px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition">
          {t('actions.donate')}
        </button>
      </form>
    </main>
  );
}
