import React, { useState } from 'react';

// Example modal for before/after details
export function AuditDetailsModal({ before, after, onClose }: { before: string | null, after: string | null, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4 text-orange-700">Audit Details</h2>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Before:</span>
          <pre className="bg-orange-50 rounded p-2 text-xs overflow-x-auto">{before || 'N/A'}</pre>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">After:</span>
          <pre className="bg-orange-50 rounded p-2 text-xs overflow-x-auto">{after || 'N/A'}</pre>
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Close</button>
      </div>
    </div>
  );
}
