import React from 'react';

export default function OfflineFallback() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <img src="/logo.png" alt="Kutumb Festival Logo" className="w-24 h-24 mb-6" />
      <h1 className="text-2xl font-bold text-orange-700 mb-2">You are offline</h1>
      <p className="text-gray-600">This app works offline, but some features may be unavailable.</p>
    </main>
  );
}
