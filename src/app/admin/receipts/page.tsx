"use client";
// src/app/admin/receipts/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { getReceipts, type Receipt } from '@/modules/ledgers/ledgerService';
import Link from 'next/link';

export default function ReceiptsPage() {
  const [receipts, setReceipts]   = useState<Receipt[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReceipts();
      setReceipts(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReceipts(); }, [fetchReceipts]);

  const filtered = receipts.filter(r => {
    const q = search.toLowerCase();
    const d = r.donations;
    return (
      r.receipt_number.toLowerCase().includes(q) ||
      (d?.donor_name ?? '').toLowerCase().includes(q) ||
      (d?.donor_email ?? '').toLowerCase().includes(q) ||
      String(d?.amount ?? '').includes(q)
    );
  });

  async function downloadPDF(receiptId: string, receiptNumber: string) {
    setDownloading(receiptId);
    try {
      const res = await fetch(`/api/receipts/download/${receiptId}`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `receipt-${receiptNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Download failed: ' + (e as Error).message);
    } finally {
      setDownloading(null);
    }
  }

  if (loading) return <div className="p-8 text-orange-700 animate-pulse">Loading receipts…</div>;
  if (error)   return (
    <div className="p-8">
      <p className="text-red-600 mb-3">{error}</p>
      <button onClick={fetchReceipts} className="px-4 py-2 bg-orange-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">Receipts</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} receipt{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/receipts/new"
          className="px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-700 transition text-sm font-medium"
        >
          + New Receipt
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by receipt #, donor name, email, amount…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-orange-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center text-gray-400">
          No receipts yet.{' '}
          <Link href="/admin/receipts/new" className="text-orange-600 underline">Create the first one.</Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="py-3 px-4 text-orange-600 font-semibold">Receipt #</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Date</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Donor</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Amount</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Mode</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Status</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const d = r.donations;
                return (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'}>
                    <td className="py-2 px-4 font-mono text-xs text-gray-700 whitespace-nowrap">
                      {r.receipt_number}
                    </td>
                    <td className="py-2 px-4 text-gray-600 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2 px-4">
                      <div className="font-medium text-gray-800">{d?.donor_name ?? '—'}</div>
                      {d?.donor_email && (
                        <div className="text-xs text-gray-400">{d.donor_email}</div>
                      )}
                    </td>
                    <td className="py-2 px-4 font-semibold text-orange-700 whitespace-nowrap">
                      {d?.amount != null ? `₹${Number(d.amount).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-2 px-4 text-gray-600 capitalize">
                      {d?.payment_mode ?? '—'}
                    </td>
                    <td className="py-2 px-4">
                      {r.voided
                        ? <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Voided</span>
                        : <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                      }
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => downloadPDF(r.id, r.receipt_number)}
                        disabled={!!r.voided || downloading === r.id}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-xs font-medium disabled:opacity-40"
                      >
                        {downloading === r.id ? '…' : '⬇ PDF'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
