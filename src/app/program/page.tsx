"use client";
import React from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';
// TODO: Replace with dynamic data from DB
const programData = [
  { time: '08:00', event: 'Opening Ceremony' },
  { time: '09:00', event: 'Bhajan Sandhya' },
  { time: '11:00', event: 'Prasad Distribution' },
  { time: '13:00', event: 'Cultural Program' },
  { time: '16:00', event: 'Closing Aarti' },
];

export default function ProgramPage() {
  const { t } = useLanguage();
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">{t('public.program.heading')}</h2>
      <div className="bg-white rounded shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-orange-600">Time</th>
              <th className="py-2 px-4 text-orange-600">Event</th>
            </tr>
          </thead>
          <tbody>
            {programData.map((item, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-2 px-4 font-medium">{item.time}</td>
                <td className="py-2 px-4">{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
