import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AUTO_EMAIL = import.meta.env.VITE_SUPABASE_EMAIL as string | undefined;
const AUTO_PASS  = import.meta.env.VITE_SUPABASE_PASSWORD as string | undefined;

export function useAuth() {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setSession(data.session);
        setLoading(false);
      } else if (AUTO_EMAIL && AUTO_PASS) {
        // Silent auto sign-in — loading stays true so AuthGate never flashes
        const { data: signInData } = await supabase!.auth.signInWithPassword({
          email: AUTO_EMAIL,
          password: AUTO_PASS,
        });
        setSession(signInData.session);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return { session, loading, configured, signOut };
}
