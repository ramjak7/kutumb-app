"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/modules/admin/authService";
import { useLanguage } from "@/modules/language/LanguageProvider";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebug(null);
    const result = await signInWithEmail(email, password);
    setLoading(false);
    setDebug(result);
    if (result.error) {
      setError(result.error.message || "Login failed");
    } else {
      // Force full reload to ensure session is picked up
      window.location.href = "/admin";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        className="bg-white rounded shadow p-8 flex flex-col gap-4 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-orange-700 mb-4">{t("admin.dashboard") || "Admin Login"}</h1>
        <label className="font-medium text-gray-700">
          {t("donor.email") || "Email"}
          <input
            type="email"
            className="mt-1 block w-full border border-orange-200 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="font-medium text-gray-700">
          {t("auth.password") || "Password"}
          <input
            type="password"
            className="mt-1 block w-full border border-orange-200 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? t("actions.sending") || "Logging in..." : t("actions.send") || "Login"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {debug && (
          <pre className="bg-orange-50 text-xs text-gray-700 mt-4 p-2 rounded overflow-x-auto">
            {JSON.stringify(debug, null, 2)}
          </pre>
        )}
      </form>
    </main>
  );
}
