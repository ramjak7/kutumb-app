"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAdmin } from "@/modules/admin/adminGuard";
import { getUser } from '@/modules/admin/authService';
import { supabase } from '@/config/supabaseClient';

export default function AdminDashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authDebug, setAuthDebug] = useState<any>(null);
  const [dbDebug, setDbDebug] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      // 1) check Supabase auth session
      const authUser = await getUser();
      setAuthDebug({ present: !!authUser, id: authUser?.id, email: authUser?.email });
      if (!authUser) {
        setError('Not authenticated (no auth session)');
        setLoading(false);
        router.replace('/login');
        return;
      }

      // 2) query users table directly to diagnose RLS / data issues
      const { data, error } = await supabase
        .from('users')
        .select('id, role, email, name, whatsapp_number')
        .eq('id', authUser.id)
        .single();
      setDbDebug({ data: data ? { id: data.id, role: data.role, email: data.email } : null, error: error?.message });

      if (error || !data) {
        setError('User row missing or RLS denied: ' + (error?.message || 'no row'));
        setLoading(false);
        // keep on the page so debug info is visible, then redirect back to login
        setTimeout(() => router.replace('/login'), 1200);
        return;
      }

      if (data.role !== 'admin') {
        setError('Not authorized (role != admin)');
        setLoading(false);
        setTimeout(() => router.replace('/login'), 1200);
        return;
      }

      // success
      setAdmin(data);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-orange-700">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }
  if (!admin) {
    return null;
  }
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
