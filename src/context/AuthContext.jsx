import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

async function ensureProfile(user) {
  if (!supabase) return;
  const { data } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!data) {
    await supabase.from('profiles').insert({
      id: user.id,
      display_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    });
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!supabase) { setUser(null); return; }

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) ensureProfile(u);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) ensureProfile(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () =>
    supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });

  const signOut = () => supabase?.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
