import React from 'react';
// TODO: Replace with Supabase data fetch
const donations = [
  { id: '1', name: 'Amit Sharma', amount: 5000, date: '2026-02-10', verified: true, hash: 'abc123' },
  { id: '2', name: 'Priya Singh', amount: 2100, date: '2026-02-11', verified: false, hash: 'def456' },
];

export default function DonationLedgerPage() {
  // Export CSV
  function exportCSV() {
    const header = ['Donor', 'Amount', 'Date', 'Verified', 'Hash'];
    const rows = donations.map(d => [d.name, d.amount, d.date, d.verified ? 'Yes' : 'No', d.hash]);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donation-ledger.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Download PDF (stub, to be implemented with actual receipt PDF logic)
  function downloadPDF(donation) {
    // TODO: Integrate with receipt PDF generation/storage
    alert('Download PDF for receipt ' + donation.id);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-700 mb-4">Donation Ledger</h1>
      <button className="mb-4 px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition" onClick={exportCSV}>
        Export CSV
      </button>
      <div className="bg-white rounded shadow p-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-orange-600">Donor</th>
              <th className="py-2 px-4 text-orange-600">Amount</th>
              <th className="py-2 px-4 text-orange-600">Date</th>
              <th className="py-2 px-4 text-orange-600">Verified</th>
              <th className="py-2 px-4 text-orange-600">Hash</th>
              <th className="py-2 px-4 text-orange-600">Actions</th>
              <th className="py-2 px-4 text-orange-600">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{donation.name}</td>
                <td className="py-2 px-4">₹{donation.amount}</td>
                <td className="py-2 px-4">{donation.date}</td>
                <td className="py-2 px-4">{donation.verified ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 font-mono text-xs">{donation.hash}</td>
                <td className="py-2 px-4">
                  {donation.verified ? (
                    <span className="text-green-600 font-semibold">Immutable</span>
                  ) : (
                    <button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Verify</button>
                  )}
                </td>
                <td className="py-2 px-4">
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition" onClick={() => downloadPDF(donation)}>
                    Download PDF
                  </button>
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
