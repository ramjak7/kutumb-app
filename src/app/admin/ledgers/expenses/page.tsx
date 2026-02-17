import React from 'react';
// TODO: Replace with Supabase data fetch
const expenses = [
  { id: '1', description: 'Stage Setup', amount: 3000, date: '2026-02-09', verified: true, hash: 'xyz789' },
  { id: '2', description: 'Prasad', amount: 1500, date: '2026-02-10', verified: false, hash: 'uvw123' },
];

export default function ExpenseLedgerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-700 mb-4">Expense Ledger</h1>
      <div className="bg-white rounded shadow p-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-orange-600">Description</th>
              <th className="py-2 px-4 text-orange-600">Amount</th>
              <th className="py-2 px-4 text-orange-600">Date</th>
              <th className="py-2 px-4 text-orange-600">Verified</th>
              <th className="py-2 px-4 text-orange-600">Hash</th>
              <th className="py-2 px-4 text-orange-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{expense.description}</td>
                <td className="py-2 px-4">₹{expense.amount}</td>
                <td className="py-2 px-4">{expense.date}</td>
                <td className="py-2 px-4">{expense.verified ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 font-mono text-xs">{expense.hash}</td>
                <td className="py-2 px-4">
                  {expense.verified ? (
                    <span className="text-green-600 font-semibold">Immutable</span>
                  ) : (
                    <button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">* All records are append-only and hash-protected. No edits or deletes allowed.</p>
    </div>
  );
}
