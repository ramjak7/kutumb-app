import { getUser } from '@/modules/admin/authService';
import { supabase } from '@/config/supabaseClient';

export async function requireAdmin() {
  const authUser = await getUser();
  if (!authUser) throw new Error('Not authenticated');
  // Fetch from users table
  const { data, error } = await supabase
    .from('users')
    .select('id, role, email, name, whatsapp_number')
    .eq('id', authUser.id)
    .single();
  if (error || !data) throw new Error('Not authorized');
  if (data.role !== 'admin') throw new Error('Not authorized');
  return data;
}
