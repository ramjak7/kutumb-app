import { supabase } from '@/config/supabaseClient';

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email: string, password: string) {
  const result = await supabase.auth.signInWithPassword({ email, password });
  // Ensure session is persisted client-side — some environments may need explicit set
  if (result.data?.session) {
    try {
      await supabase.auth.setSession({
        access_token: result.data.session.access_token,
        refresh_token: result.data.session.refresh_token,
      });
    } catch (e) {
      // ignore — setSession may throw in non-browser contexts
      console.warn('setSession failed', e);
    }
  }
  return result;
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
