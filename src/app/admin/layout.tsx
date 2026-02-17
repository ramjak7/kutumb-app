"use client";
import React from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/ledgers', label: 'Ledgers' },
  { href: '/admin/receipts', label: 'Receipts' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/audit', label: 'Audit Log' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-orange-50">
      <aside className="w-64 bg-white border-r border-orange-100 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-orange-700 mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="px-3 py-2 rounded hover:bg-orange-100 text-orange-700 font-medium">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
