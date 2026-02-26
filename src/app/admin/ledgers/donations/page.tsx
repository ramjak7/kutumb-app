"use client";
// src/app/admin/ledgers/donations/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { getDonations, type Donation } from '@/modules/ledgers/ledgerService';

type SortKey = 'created_at' | 'amount' | 'donor_name';

export default function DonationLedgerPage() {
  const [donations, setDonations]   = useState<Donation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [sortKey, setSortKey]       = useState<SortKey>('created_at');
  const [sortAsc, setSortAsc]       = useState(false);
  const [search, setSearch]         = useState('');
  const [exporting, setExporting]   = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [verifying, setVerifying]   = useState<string | null>(null);
  const [reversing, setReversing]   = useState<string | null>(null);
  const [reverseForm, setReverseForm] = useState<{
    donationId: string;
    reason: string;
    newAmount: string;
    newDonorName: string;
  } | null>(null);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const filtered = donations
    .filter(d => {
      const q = search.toLowerCase();
      return (
        (d.donor_name ?? '').toLowerCase().includes(q) ||
        (d.donor_email ?? '').toLowerCase().includes(q) ||
        (d.donor_pan ?? '').toLowerCase().includes(q) ||
        String(d.amount).includes(q)
      );
    })
    .sort((a, b) => {
      let av: string | number = a[sortKey] ?? '';
      let bv: string | number = b[sortKey] ?? '';
      if (sortKey === 'amount') { av = Number(av); bv = Number(bv); }
      return sortAsc
        ? av < bv ? -1 : av > bv ? 1 : 0
        : av > bv ? -1 : av < bv ? 1 : 0;
    });

  const total = filtered.reduce((sum, d) => sum + Number(d.amount), 0);

  async function exportCSV() {
    setExporting(true);
    try {
      const res = await fetch('/api/export/donations');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `donations-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('CSV export failed: ' + (e as Error).message);
    } finally {
      setExporting(false);
    }
  }

  async function downloadReceipt(donationId: string) {
    setDownloading(donationId);
    try {
      const res = await fetch(`/api/receipts/find?donationId=${donationId}`);
      if (!res.ok) {
        alert('No receipt found for this donation. Generate one first.');
        return;
      }
      const { receiptId } = await res.json();
      const pdfRes = await fetch(`/api/receipts/download/${receiptId}`);
      if (!pdfRes.ok) throw new Error('Download failed');
      const blob = await pdfRes.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `receipt-${donationId.slice(0,8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Download failed: ' + (e as Error).message);
    } finally {
      setDownloading(null);
    }
  }

  async function verifyDonation(donationId: string) {
    if (!confirm('Verify this donation? This action is irreversible.')) return;
    setVerifying(donationId);
    try {
      const res = await fetch('/api/donations/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      alert('Donation verified successfully!');
      fetchDonations();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setVerifying(null);
    }
  }

  async function submitReversal() {
    if (!reverseForm) return;
    try {
      const res = await fetch('/api/donations/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: reverseForm.donationId,
          reason: reverseForm.reason,
          newAmount: reverseForm.newAmount ? Number(reverseForm.newAmount) : null,
          newDonorName: reverseForm.newDonorName || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reversal failed');
      alert('Reversal created successfully!');
      setReverseForm(null);
      fetchDonations();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="ml-1 text-orange-300">↕</span>;
    return <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>;
  }

  if (loading) return <div className="p-8 text-orange-700 animate-pulse">Loading donations…</div>;
  if (error)   return (
    <div className="p-8">
      <p className="text-red-600 mb-3">{error}</p>
      <button onClick={fetchDonations} className="px-4 py-2 bg-orange-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">Donation Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''} · 
            Total: <span className="font-semibold text-orange-700">₹{total.toLocaleString('en-IN')}</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/admin/receipts/new" className="px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-700 transition text-sm font-medium">
            + New Receipt
          </a>
          <button onClick={exportCSV} disabled={exporting} className="px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded shadow hover:bg-orange-50 transition text-sm font-medium disabled:opacity-50">
            {exporting ? 'Exporting…' : '⬇ Export CSV'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input type="text" placeholder="Search by name, email, PAN, amount…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-orange-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Reversal Modal */}
      {reverseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-orange-700 mb-4">Reverse Donation</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reversal *</label>
                <textarea value={reverseForm.reason} onChange={e => setReverseForm({...reverseForm, reason: e.target.value})} rows={3}
                  className="w-full border border-orange-200 rounded px-3 py-2 text-sm" placeholder="Explain why this is being reversed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corrected Amount (optional)</label>
                <input type="number" value={reverseForm.newAmount} onChange={e => setReverseForm({...reverseForm, newAmount: e.target.value})}
                  className="w-full border border-orange-200 rounded px-3 py-2 text-sm" placeholder="Leave empty to just cancel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corrected Donor Name (optional)</label>
                <input type="text" value={reverseForm.newDonorName} onChange={e => setReverseForm({...reverseForm, newDonorName: e.target.value})}
                  className="w-full border border-orange-200 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={submitReversal} disabled={!reverseForm.reason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
                  Create Reversal
                </button>
                <button onClick={() => setReverseForm(null)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center text-gray-400">No donations found.</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="py-3 px-4 text-orange-600 font-semibold cursor-pointer select-none" onClick={() => toggleSort('created_at')}>
                  Date <SortIcon k="created_at" />
                </th>
                <th className="py-3 px-4 text-orange-600 font-semibold cursor-pointer select-none" onClick={() => toggleSort('donor_name')}>
                  Donor <SortIcon k="donor_name" />
                </th>
                <th className="py-3 px-4 text-orange-600 font-semibold cursor-pointer select-none" onClick={() => toggleSort('amount')}>
                  Amount <SortIcon k="amount" />
                </th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Type</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Verified</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const isReversal = (d as any).is_reversal;
                const amountClass = Number(d.amount) < 0 ? 'text-red-700' : 'text-orange-700';
                return (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'}>
                    <td className="py-2 px-4 text-gray-600 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2 px-4">
                      <div className="font-medium text-gray-800">{d.donor_name ?? '—'}</div>
                      {d.donor_email && <div className="text-xs text-gray-400">{d.donor_email}</div>}
                    </td>
                    <td className={`py-2 px-4 font-semibold ${amountClass} whitespace-nowrap`}>
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-4 text-xs">
                      {isReversal ? (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">Reversal</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">Original</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {d.verified ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Verified</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        {!d.verified && !isReversal && (
                          <button onClick={() => verifyDonation(d.id)} disabled={verifying === d.id}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs font-medium disabled:opacity-50">
                            {verifying === d.id ? '...' : 'Verify'}
                          </button>
                        )}
                        {d.verified && !isReversal && (
                          <button onClick={() => setReverseForm({ donationId: d.id, reason: '', newAmount: '', newDonorName: '' })}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-medium">
                            Reverse
                          </button>
                        )}
                        {!isReversal && (
                          <button onClick={() => downloadReceipt(d.id)} disabled={downloading === d.id}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-xs font-medium disabled:opacity-50">
                            {downloading === d.id ? '…' : '⬇ PDF'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        * All records are append-only and hash-protected. Verified entries cannot be edited — only reversed with reason.
      </p>
    </div>
  );
}
