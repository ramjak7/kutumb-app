import { supabase } from '@/config/supabaseClient';

export async function getAdminWhatsAppNumber() {
  // Get the first admin user (assuming only one admin for now)
  const { data, error } = await supabase
    .from('users')
    .select('whatsapp_number')
    .eq('role', 'admin')
    .limit(1)
    .single();
  return { number: data?.whatsapp_number || '', error };
}
