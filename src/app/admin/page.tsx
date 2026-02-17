import React from 'react';

export default function AdminDashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-700 mb-4">Welcome, Admin</h1>
      {/* TODO: Add stats widgets for donations, expenses, receipts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Donations</h2>
          <p className="text-2xl text-orange-600 font-bold">₹0</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h2>
          <p className="text-2xl text-orange-600 font-bold">₹0</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Receipts Issued</h2>
          <p className="text-2xl text-orange-600 font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
