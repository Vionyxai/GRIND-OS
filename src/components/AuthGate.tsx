import { FormEvent, ReactNode, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0A0A0F',
  border: '1px solid #1E1E2E',
  borderRadius: '8px',
  padding: '12px',
  fontSize: '15px',
  color: '#F8F9FA',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
};

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading, configured, signInWithEmail } = useAuth();
  const [dismissed, setDismissed] = useLocalStorage<boolean>('grindos_auth_prompt_dismissed', false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (!configured || loading || session || dismissed) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError('');
    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send link');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A0A0F' }}
    >
      <div
        className="w-full rounded-xl p-6"
        style={{ maxWidth: '380px', backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
      >
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '28px',
            color: '#E63946',
            letterSpacing: '0.06em',
          }}
        >
          GRIND OS
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6C757D', marginTop: '4px', marginBottom: '20px' }}>
          Sign in to sync across devices and connect LearningAI to your Skills &amp; Learning pillar.
        </p>

        {sent ? (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#06D6A0' }}>
            Check {email} for a magic link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoFocus
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={sending || !email}
              style={{
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#E63946',
                color: '#F8F9FA',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                minHeight: '44px',
                cursor: sending || !email ? 'default' : 'pointer',
                opacity: sending || !email ? 0.6 : 1,
              }}
            >
              {sending ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}

        {error && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#E63946', marginTop: '10px' }}>
            {error}
          </p>
        )}

        <button
          onClick={() => setDismissed(true)}
          style={{
            marginTop: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#6C757D',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Continue without an account
        </button>
      </div>
    </div>
  );
}
