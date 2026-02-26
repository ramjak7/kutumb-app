"use client";
// src/app/admin/expenses/new/page.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormState {
  description: string;
  category: string;
  vendor: string;
  amount: string;
  paymentMode: string;
}

const INITIAL: FormState = {
  description: '',
  category: '',
  vendor: '',
  amount: '',
  paymentMode: 'cash',
};

const CATEGORIES = [
  'Venue & Setup',
  'Food & Prasad',
  'Decorations',
  'Audio/Video Equipment',
  'Transportation',
  'Printing & Materials',
  'Staff & Volunteers',
  'Miscellaneous',
];

export default function NewExpensePage() {
  const router = useRouter();
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/expenses/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          description:   form.description.trim(),
          category:      form.category,
          vendor:        form.vendor.trim() || undefined,
          amount:        form.amount,
          paymentMode:   form.paymentMode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create expense');

      setSuccess(true);
      setTimeout(() => router.push('/admin/ledgers/expenses'), 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-orange-700 mb-1">Expense Recorded</h2>
        <p className="text-gray-500 text-sm mb-6">Redirecting to expense ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-orange-700">New Expense Entry</h1>
        <p className="text-sm text-gray-500 mt-1">Record a festival expense for verification.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">

        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
            Expense Details
          </legend>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              required
              rows={3}
              placeholder="What was this expense for?"
              className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={set('category')}
                required
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={set('amount')}
                required
                min="1"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input
                type="text"
                value={form.vendor}
                onChange={set('vendor')}
                placeholder="Vendor or supplier name"
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                value={form.paymentMode}
                onChange={set('paymentMode')}
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="online">Online Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>
        </fieldset>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Record Expense'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/ledgers/expenses')}
            className="px-5 py-3 border border-orange-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
