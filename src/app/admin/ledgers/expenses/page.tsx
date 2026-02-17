"use client";
// src/app/admin/ledgers/expenses/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { getExpenses, type Expense } from '@/modules/ledgers/ledgerService';

type SortKey = 'created_at' | 'amount';

export default function ExpenseLedgerPage() {
  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [sortKey, setSortKey]     = useState<SortKey>('created_at');
  const [sortAsc, setSortAsc]     = useState(false);
  const [search, setSearch]       = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const filtered = expenses
    .filter(e => {
      const q = search.toLowerCase();
      const details = e.expense_details as Record<string, unknown>;
      return (
        String(details?.description ?? '').toLowerCase().includes(q) ||
        String(details?.category ?? '').toLowerCase().includes(q) ||
        String(e.amount).includes(q)
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

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  async function exportCSV() {
    setExporting(true);
    try {
      const res  = await fetch('/api/export/expenses');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `expenses-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed: ' + (e as Error).message);
    } finally {
      setExporting(false);
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

  if (loading) return <div className="p-8 text-orange-700 animate-pulse">Loading expenses…</div>;
  if (error)   return (
    <div className="p-8">
      <p className="text-red-600 mb-3">{error}</p>
      <button onClick={fetchExpenses} className="px-4 py-2 bg-orange-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">Expense Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
            Total: <span className="font-semibold text-orange-700">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded shadow hover:bg-orange-50 transition text-sm font-medium disabled:opacity-50"
        >
          {exporting ? 'Exporting…' : '⬇ Export CSV'}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by description or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-orange-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center text-gray-400">
          No expenses found.
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="py-3 px-4 text-orange-600 font-semibold cursor-pointer select-none" onClick={() => toggleSort('created_at')}>
                  Date <SortIcon k="created_at" />
                </th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Description</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Category</th>
                <th className="py-3 px-4 text-orange-600 font-semibold cursor-pointer select-none" onClick={() => toggleSort('amount')}>
                  Amount <SortIcon k="amount" />
                </th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Verified</th>
                <th className="py-3 px-4 text-orange-600 font-semibold">Hash</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const details = e.expense_details as Record<string, unknown>;
                return (
                  <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'}>
                    <td className="py-2 px-4 text-gray-600 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2 px-4 text-gray-800">
                      {String(details?.description ?? '—')}
                    </td>
                    <td className="py-2 px-4 text-gray-600">
                      {String(details?.category ?? '—')}
                    </td>
                    <td className="py-2 px-4 font-semibold text-orange-700 whitespace-nowrap">
                      ₹{Number(e.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-4">
                      {e.verified
                        ? <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Verified</span>
                        : <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>
                      }
                    </td>
                    <td className="py-2 px-4 font-mono text-xs text-gray-400 max-w-[80px] truncate" title={e.hash}>
                      {e.hash.slice(0, 10)}…
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        * All records are append-only and hash-protected. No edits or deletes are permitted.
      </p>
    </div>
  );
}
