// src/app/admin/ledgers/page.tsx
"use client";
import Link from 'next/link';

export default function LedgersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-700 mb-6">Ledgers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/ledgers/donations" 
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition border-2 border-transparent hover:border-orange-300">
          <h2 className="text-xl font-semibold text-orange-700 mb-2">💰 Donations</h2>
          <p className="text-gray-600 text-sm">View and manage all donation entries</p>
        </Link>
        
        <Link href="/admin/ledgers/expenses" 
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition border-2 border-transparent hover:border-orange-300">
          <h2 className="text-xl font-semibold text-orange-700 mb-2">📝 Expenses</h2>
          <p className="text-gray-600 text-sm">View and manage all expense entries</p>
        </Link>
      </div>
    </div>
  );
}