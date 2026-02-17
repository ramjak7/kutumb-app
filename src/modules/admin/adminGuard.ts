import { getUser } from '@/modules/admin/authService';

export async function requireAdmin() {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  // Assume user role is stored in user.user_metadata.role
  if (user.user_metadata?.role !== 'admin') throw new Error('Not authorized');
  return user;
}
