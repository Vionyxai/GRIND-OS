import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading, configured } = useAuth();

  // While auto sign-in is in progress, render children (loading=true)
  // Once signed in, session is set and we render children
  // If Supabase not configured, render children too
  if (!configured || loading || session) {
    return <>{children}</>;
  }

  // Configured but sign-in failed — show a minimal message, no form needed
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A0A0F' }}
    >
      <div
        className="w-full rounded-xl p-6 text-center"
        style={{ maxWidth: '380px', backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
      >
        <p style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', color: '#E63946', letterSpacing: '0.06em' }}>
          GRIND OS
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', marginTop: '8px' }}>
          Signing in...
        </p>
      </div>
    </div>
  );
}
