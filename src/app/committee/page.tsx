"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';
import { supabase } from '@/config/supabaseClient';

type CommitteeMember = { name: string; role: string };

export default function CommitteePage() {
  const { t } = useLanguage();
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommittee() {
      setLoading(true);
      setError(null);
      // Fetch the first festival's committee_data
      const { data, error } = await supabase
        .from('festivals')
        .select('committee_data')
        .limit(1)
        .single();
      if (error) {
        setError('Could not load committee data.');
        setCommittee([]);
      } else {
        setCommittee(data?.committee_data || []);
      }
      setLoading(false);
    }
    fetchCommittee();
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">{t('public.committee.heading')}</h2>
      <div className="bg-white rounded shadow p-6">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : committee.length === 0 ? (
          <div className="text-gray-500">No committee data found.</div>
        ) : (
          <ul className="divide-y divide-orange-100">
            {committee.map((member, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <span className="font-medium text-gray-800">{member.name}</span>
                <span className="text-orange-600">{member.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
