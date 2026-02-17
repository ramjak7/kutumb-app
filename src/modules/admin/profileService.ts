import { supabase } from '@/config/supabaseClient';

export async function getAdminProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, whatsapp_number')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateAdminWhatsApp(userId: string, whatsapp_number: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ whatsapp_number })
    .eq('id', userId)
    .single();
  return { data, error };
}
