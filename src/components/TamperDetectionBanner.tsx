import React from 'react';

export function TamperDetectionBanner({ valid }: { valid: boolean }) {
  return valid ? null : (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
      <strong>Warning:</strong> Tampering detected in audit log hashes!
    </div>
  );
}
