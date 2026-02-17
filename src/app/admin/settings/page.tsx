"use client";
import React, { useEffect, useState } from "react";
import { getUser } from "@/modules/admin/authService";
import { getAdminProfile, updateAdminWhatsApp } from "@/modules/admin/profileService";

export default function FestivalSettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const user = await getUser();
      if (user) {
        const { data } = await getAdminProfile(user.id);
        setWhatsapp(data?.whatsapp_number || "");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const user = await getUser();
    if (!user) {
      setError("Not authenticated");
      setSaving(false);
      return;
    }
    const { error } = await updateAdminWhatsApp(user.id, whatsapp);
    if (error) {
      setError(error.message || "Failed to update");
    } else {
      setSuccess(true);
    }
    setSaving(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-700 mb-4">Festival Settings</h1>
      <div className="bg-white rounded shadow p-6 max-w-lg">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <label className="font-medium text-gray-700">
            WhatsApp Number
            <input
              type="text"
              className="mt-1 block w-full border border-orange-200 rounded px-3 py-2"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="e.g. +919999999999"
              disabled={loading || saving}
            />
          </label>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition"
            disabled={loading || saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {success && <p className="text-green-600">WhatsApp number updated!</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
