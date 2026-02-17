"use client";
import React from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';
import { getAdminWhatsAppNumber } from '@/modules/admin/getAdminWhatsAppNumber';

export default function ContactPage() {
  const { t } = useLanguage();
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [whatsapp, setWhatsapp] = React.useState<string>("");

  React.useEffect(() => {
    async function fetchNumber() {
      const { number } = await getAdminWhatsAppNumber();
      setWhatsapp(number);
    }
    fetchNumber();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    try {
      // Send email
      const emailRes = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (!emailRes.ok) throw new Error("Email send failed");
      // Send WhatsApp (only if number is set)
      if (whatsapp) {
        const waRes = await fetch("/api/messaging/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: whatsapp, body: `Contact from ${name}: ${message}` }),
        });
        if (!waRes.ok) throw new Error("WhatsApp send failed");
      }
      setStatus("success");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Unknown error");
    }
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">{t('public.contact.heading')}</h2>
      <div className="bg-white rounded shadow p-6 mb-8">
        <p className="mb-4 text-gray-700">
          {/* TODO: Add translation key for this message */}
          For questions, suggestions, or to volunteer, please contact the festival committee.
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Email: <a href="mailto:info@kutumbfest.org" className="text-orange-600">info@kutumbfest.org</a></li>
          {whatsapp && (
            <li>WhatsApp: <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} className="text-orange-600">{whatsapp}</a></li>
          )}
          <li>WhatsApp: <a href="https://wa.me/919999999999" className="text-orange-600">+91-99999-99999</a></li>
        </ul>
      </div>
      <form className="bg-orange-50 rounded shadow p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="font-medium text-gray-700">
          {t('donor.name')}
          <input type="text" name="name" className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <label className="font-medium text-gray-700">
          {/* TODO: Add translation key for 'Message' */}
          Message
          <textarea name="message" rows={4} className="mt-1 block w-full border border-orange-200 rounded px-3 py-2" required />
        </label>
        <button type="submit" className="mt-4 px-6 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition" disabled={status === 'sending'}>
          {status === 'sending' ? t('actions.sending') || 'Sending...' : t('actions.send')}
        </button>
        {status === 'success' && (
          <p className="text-green-600 mt-2">{t('contact.success') || 'Message sent successfully!'}</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-2">{t('contact.error') || 'Failed to send message.'} {error && <span>({error})</span>}</p>
        )}
      </form>
    </main>
  );
}
