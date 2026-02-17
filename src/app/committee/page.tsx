"use client";
import React from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';
// TODO: Replace with dynamic data from DB
const committee = [
  { name: 'Shri Ram Sharma', role: 'President' },
  { name: 'Smt. Sita Devi', role: 'Vice President' },
  { name: 'Shri Laxman Singh', role: 'Treasurer' },
  { name: 'Smt. Radha Gupta', role: 'Secretary' },
  { name: 'Shri Bharat Lal', role: 'Member' },
];

export default function CommitteePage() {
  const { t } = useLanguage();
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">{t('public.committee.heading')}</h2>
      <div className="bg-white rounded shadow p-6">
        <ul className="divide-y divide-orange-100">
          {committee.map((member, idx) => (
            <li key={idx} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-800">{member.name}</span>
              <span className="text-orange-600">{member.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
