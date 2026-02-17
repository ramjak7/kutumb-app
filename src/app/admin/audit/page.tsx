import React from 'react';
// TODO: Replace with Supabase data fetch
const auditLogs = [
  {
    id: '1',
    user: 'admin@kutumbfest.org',
    action: 'INSERT',
    table: 'donations',
    recordId: 'abc123',
    before: null,
    after: '{"amount":5000}',
    hash: 'hash1',
    timestamp: '2026-02-10 10:00',
  },
  {
    id: '2',
    user: 'admin@kutumbfest.org',
    action: 'VERIFY',
    table: 'donations',
    recordId: 'abc123',
    before: '{"verified":false}',
    after: '{"verified":true}',
    hash: 'hash2',
    timestamp: '2026-02-10 10:05',
  },
];

export default function AuditLogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-700 mb-4">Audit Log</h1>
      <div className="bg-white rounded shadow p-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-orange-600">Timestamp</th>
              <th className="py-2 px-4 text-orange-600">User</th>
              <th className="py-2 px-4 text-orange-600">Action</th>
              <th className="py-2 px-4 text-orange-600">Table</th>
              <th className="py-2 px-4 text-orange-600">Record ID</th>
              <th className="py-2 px-4 text-orange-600">Hash</th>
              <th className="py-2 px-4 text-orange-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{log.timestamp}</td>
                <td className="py-2 px-4">{log.user}</td>
                <td className="py-2 px-4">{log.action}</td>
                <td className="py-2 px-4">{log.table}</td>
                <td className="py-2 px-4 font-mono text-xs">{log.recordId}</td>
                <td className="py-2 px-4 font-mono text-xs">{log.hash}</td>
                <td className="py-2 px-4">
                  <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-xs">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">* All admin actions are logged with before/after snapshots and hashes.</p>
    </div>
  );
}
