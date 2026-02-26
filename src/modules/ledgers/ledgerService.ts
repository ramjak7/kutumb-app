// src/modules/ledgers/ledgerService.ts
import { supabase } from '@/config/supabaseClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Donation {
  id: string;
  amount: number;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  donor_address: string | null;
  donor_pan: string | null;
  payment_mode: string | null;
  transaction_number: string | null;
  donor_details: Record<string, unknown>;
  verified: boolean;
  verified_by: string | null;           // ← ADD
  verified_at: string | null;           // ← ADD
  is_reversal: boolean;                 // ← ADD
  reversal_reason: string | null;       // ← ADD
  reverses_id: string | null;           // ← ADD
  category: string | null;              // ← ADD
  hash: string;
  created_at: string;
  festival_id: string | null;
  user_id: string | null;               // ← ADD
}

export interface Expense {
  id: string;
  amount: number;
  description: string | null;           // ← ADD
  category: string | null;              // ← ADD
  vendor: string | null;                // ← ADD
  payment_mode: string | null;          // ← ADD
  expense_details: Record<string, unknown>;
  verified: boolean;
  verified_by: string | null;           // ← ADD
  verified_at: string | null;           // ← ADD
  is_reversal: boolean;                 // ← ADD
  reversal_reason: string | null;       // ← ADD
  reverses_id: string | null;           // ← ADD
  hash: string;
  created_at: string;
  festival_id: string | null;
  user_id: string | null;               // ← ADD
}

export interface Receipt {
  id: string;
  donation_id: string | null;
  festival_id: string | null;
  receipt_number: string;
  qr_code: string;
  hash: string;
  voided: boolean;
  voided_at: string | null;
  created_at: string;
  donations?: Donation;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getDonations(): Promise<Donation[]> {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Donation[];
}

export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Expense[];
}

export async function getReceipts(): Promise<Receipt[]> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*, donations(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Receipt[];
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*, donations(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Receipt;
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function addDonation(donation: Partial<Donation>) {
  return supabase.from('donations').insert([donation]).select().single();
}

export async function addExpense(expense: Partial<Expense>) {
  return supabase.from('expenses').insert([expense]).select().single();
}

export async function verifyDonation(id: string) {
  return supabase.rpc('verify_donation', { donation_id: id });
}

export async function verifyExpense(id: string) {
  return supabase.rpc('verify_expense', { expense_id: id });
}

export async function reversalEntry(
  table: 'donations' | 'expenses',
  reversal: Partial<Donation | Expense>
) {
  return supabase.from(table).insert([reversal]);
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function donationsToCSV(donations: Donation[]): string {
  const headers = [
    'Receipt#', 'Date', 'Donor Name', 'Amount (INR)', 'Payment Mode',
    'Transaction #', 'Phone', 'Email', 'PAN', 'Address', 'Category',
    'Verified', 'Verified By', 'Verified At', 'Is Reversal', 'Reversal Reason', 'Hash'
  ];
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = donations.map(d => [
    escape(d.donor_details?.receiptNumber ?? ''),
    escape(new Date(d.created_at).toLocaleDateString('en-IN')),
    escape(d.donor_name ?? d.donor_details?.donorName ?? ''),
    escape(d.amount),
    escape(d.payment_mode ?? ''),
    escape(d.transaction_number ?? ''),
    escape(d.donor_phone ?? ''),
    escape(d.donor_email ?? ''),
    escape(d.donor_pan ?? ''),
    escape(d.donor_address ?? ''),
    escape(d.category ?? ''),
    escape(d.verified ? 'Yes' : 'No'),
    escape(d.verified_by ?? ''),
    escape(d.verified_at ? new Date(d.verified_at).toLocaleDateString('en-IN') : ''),
    escape(d.is_reversal ? 'Yes' : 'No'),
    escape(d.reversal_reason ?? ''),
    escape(d.hash),
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function expensesToCSV(expenses: Expense[]): string {
  const headers = [
    'Date', 'Description', 'Category', 'Vendor', 'Amount (INR)', 'Payment Mode',
    'Verified', 'Verified By', 'Verified At', 'Is Reversal', 'Reversal Reason', 'Hash'
  ];
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = expenses.map(e => [
    escape(new Date(e.created_at).toLocaleDateString('en-IN')),
    escape(e.description ?? ''),
    escape(e.category ?? ''),
    escape(e.vendor ?? ''),
    escape(e.amount),
    escape(e.payment_mode ?? ''),
    escape(e.verified ? 'Yes' : 'No'),
    escape(e.verified_by ?? ''),
    escape(e.verified_at ? new Date(e.verified_at).toLocaleDateString('en-IN') : ''),
    escape(e.is_reversal ? 'Yes' : 'No'),
    escape(e.reversal_reason ?? ''),
    escape(e.hash),
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}
