"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/modules/admin/authService";

export default function AdminDashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await getUser();
      if (!user || user.user_metadata?.role !== "admin") {
        router.replace("/login");
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-orange-700">Loading...</div>;
  }
  if (!isAdmin) {
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
