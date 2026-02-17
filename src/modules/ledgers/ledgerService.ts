// Service for immutable ledger actions
import { supabase } from '@/config/supabaseClient';

export async function addDonation(donation: any) {
  // Only insert, never update/delete
  return supabase.from('donations').insert([donation]);
}

export async function addExpense(expense: any) {
  // Only insert, never update/delete
  return supabase.from('expenses').insert([expense]);
}

export async function verifyDonation(id: string) {
  // Only allow update if not verified
  return supabase.rpc('verify_donation', { donation_id: id });
}

export async function verifyExpense(id: string) {
  // Only allow update if not verified
  return supabase.rpc('verify_expense', { expense_id: id });
}

export async function reversalEntry(table: 'donations' | 'expenses', reversal: any) {
  // Insert a negative amount entry for correction
  return supabase.from(table).insert([reversal]);
}
