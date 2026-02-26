"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from '@/modules/admin/authService';
import { supabase } from '@/config/supabaseClient';
import { getDonations, getExpenses, getReceipts } from '@/modules/ledgers/ledgerService';

export default function AdminDashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authDebug, setAuthDebug] = useState<any>(null);
  const [dbDebug, setDbDebug] = useState<any>(null);
  const [stats, setStats] = useState({ donations: 0, expenses: 0, receipts: 0 });

  useEffect(() => {
    async function checkAuth() {
      // 1) check Supabase auth session
      const authUser = await getUser();
      setAuthDebug({ present: !!authUser, id: authUser?.id, email: authUser?.email });
      console.log('admin page: authUser', authUser);
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
      console.log('admin page: users table lookup', { data, error });

      if (error || !data) {
        setError('User row missing or RLS denied: ' + (error?.message || 'no row'));
        setLoading(false);
        // keep on the page so debug info is visible, then redirect back to login
        setTimeout(() => router.replace('/login'), 1200);
        return;
      }

      if (data.role !== 'admin' && data.role !== 'superadmin' && data.role !== 'treasurer') {
        setError('Not authorized (role must be admin, superadmin, or treasurer)');
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

  useEffect(() => {
    async function fetchStats() {
      try {
        const [donations, expenses, receipts] = await Promise.all([
          getDonations(),
          getExpenses(),
          getReceipts(),
        ]);
        
        const totalDonations = donations
          .filter(d => !d.is_reversal)
          .reduce((sum, d) => sum + Number(d.amount), 0);
        
        const totalExpenses = expenses
          .filter(e => !e.is_reversal)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        
        const receiptsCount = receipts.filter(r => !r.voided).length;
        
        setStats({
          donations: totalDonations,
          expenses: totalExpenses,
          receipts: receiptsCount,
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    }
    
    if (admin) {
      fetchStats();
    }
  }, [admin]);

  if (loading) {
    return (
      <div className="p-8 text-orange-700">
        Loading...
        <pre className="mt-4 text-xs bg-orange-50 p-2 rounded">authDebug: {JSON.stringify(authDebug)}</pre>
        <pre className="mt-2 text-xs bg-orange-50 p-2 rounded">dbDebug: {JSON.stringify(dbDebug)}</pre>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="bg-orange-50 p-4 rounded">
          <strong className="text-sm">authDebug</strong>
          <pre className="text-xs mt-2 p-2 bg-white rounded border">{JSON.stringify(authDebug, null, 2)}</pre>
          <strong className="text-sm mt-4 block">dbDebug</strong>
          <pre className="text-xs mt-2 p-2 bg-white rounded border">{JSON.stringify(dbDebug, null, 2)}</pre>
        </div>
      </div>
    );
  }
  if (!admin) {
    return null;
  }
  return (
    <div>
      <div className="mb-4 p-3 bg-orange-50 rounded border">
        <strong className="block">Debug</strong>
        <div className="text-xs mt-2">auth: {authDebug?.email} ({authDebug?.id})</div>
        <div className="text-xs">db: {admin?.email} — role: {admin?.role}</div>
      </div>
      <h1 className="text-3xl font-bold text-orange-700 mb-4">Welcome, Admin</h1>
      {/* TODO: Add stats widgets for donations, expenses, receipts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Donations</h2>
          <p className="text-2xl text-orange-600 font-bold">₹ {stats.donations.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h2>
          <p className="text-2xl text-orange-600 font-bold">₹ {stats.expenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Receipts Issued</h2>
          <p className="text-2xl text-orange-600 font-bold">{stats.receipts}</p>
        </div>
      </div>
    </div>
  );
}
