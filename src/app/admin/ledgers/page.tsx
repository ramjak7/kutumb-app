// src/app/admin/ledgers/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LedgersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/ledgers/donations');
  }, [router]);
  return null;
}