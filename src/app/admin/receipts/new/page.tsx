"use client";
// src/app/admin/receipts/new/page.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormState {
  donorName: string;
  amount: string;
  paymentMode: string;
  transactionNumber: string;
  donorPhone: string;
  donorEmail: string;
  donorAddress: string;
  donorPan: string;
}

const INITIAL: FormState = {
  donorName: '', amount: '', paymentMode: 'cash',
  transactionNumber: '', donorPhone: '', donorEmail: '',
  donorAddress: '', donorPan: '',
};

export default function NewReceiptPage() {
  const router = useRouter();
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<{ receiptId: string; receiptNumber: string; downloadUrl: string } | null>(null);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/receipts/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          donorName:         form.donorName.trim(),
          amount:            form.amount,
          paymentMode:       form.paymentMode || undefined,
          transactionNumber: form.transactionNumber.trim() || undefined,
          donorPhone:        form.donorPhone.trim() || undefined,
          donorEmail:        form.donorEmail.trim() || undefined,
          donorAddress:      form.donorAddress.trim() || undefined,
          donorPan:          form.donorPan.trim().toUpperCase() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate receipt');

      setSuccess(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!success) return;
    const res  = await fetch(success.downloadUrl);
    if (!res.ok) { alert('Download failed'); return; }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `receipt-${success.receiptNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-orange-700 mb-1">Receipt Generated</h2>
        <p className="text-gray-500 text-sm mb-6">
          Receipt number: <span className="font-mono font-semibold text-gray-700">{success.receiptNumber}</span>
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={downloadPDF}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            ⬇ Download PDF Receipt
          </button>
          <button
            onClick={() => { setSuccess(null); setForm(INITIAL); }}
            className="w-full py-3 bg-orange-50 text-orange-700 rounded-lg font-semibold hover:bg-orange-100 transition"
          >
            + Generate Another
          </button>
          <button
            onClick={() => router.push('/admin/receipts')}
            className="w-full py-3 border border-orange-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            View All Receipts
          </button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-orange-700">New Donation Receipt</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in donor details to generate and download a PDF receipt.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">

        {/* ── Required section ── */}
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
            Required Details
          </legend>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Donor Name / दाता का नाम <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.donorName}
              onChange={set('donorName')}
              required
              placeholder="Full name as to appear on receipt"
              className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) / राशि <span className="text-red-500">*</span>
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

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode / भुगतान विधि <span className="text-red-500">*</span>
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

        {/* ── Optional section ── */}
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
            Optional Details
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction # / लेनदेन #</label>
              <input
                type="text"
                value={form.transactionNumber}
                onChange={set('transactionNumber')}
                placeholder="UPI ref / cheque no."
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone / फ़ोन</label>
              <input
                type="tel"
                value={form.donorPhone}
                onChange={set('donorPhone')}
                placeholder="+91 XXXXXXXXXX"
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email / ईमेल</label>
              <input
                type="email"
                value={form.donorEmail}
                onChange={set('donorEmail')}
                placeholder="donor@example.com"
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
              <input
                type="text"
                value={form.donorPan}
                onChange={set('donorPan')}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address / पता</label>
            <textarea
              value={form.donorAddress}
              onChange={set('donorAddress')}
              rows={2}
              placeholder="Donor's address (optional)"
              className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>
        </fieldset>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate Receipt & Download PDF'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/receipts')}
            className="px-5 py-3 border border-orange-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
