import { ReactNode, useCallback, useEffect, useState } from 'react';
import { KEYS } from '../utils/storage';

const SESSION_KEY = 'grindos_unlocked';

function getStoredPin(): string {
  return localStorage.getItem(KEYS.PIN) ?? '';
}

function isUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

// Keypad layout: rows of button labels ('del' = backspace, '' = empty)
const KEYPAD: string[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export function AuthGate({ children }: { children: ReactNode }) {
  const [pin] = useState(getStoredPin);
  const [unlocked, setUnlocked] = useState(() => !getStoredPin() || isUnlocked());
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  const handleKey = useCallback((key: string) => {
    if (key === 'del') {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    setInput((prev) => {
      const next = prev + key;
      if (next.length === 4) {
        if (next === pin) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          setTimeout(() => setUnlocked(true), 80);
        } else {
          setTimeout(() => {
            setShake(true);
            setTimeout(() => { setShake(false); setInput(''); }, 500);
          }, 0);
          return next;
        }
      }
      return next;
    });
  }, [pin]);

  // Hardware keyboard support
  useEffect(() => {
    if (unlocked) return;
    const handler = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) handleKey(e.key);
      if (e.key === 'Backspace') handleKey('del');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [unlocked, handleKey]);

  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#0A0A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .pin-shake { animation: shake 0.45s ease; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '320px', padding: '0 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px',
      }}>
        {/* Logo */}
        <p style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '36px', color: '#E63946', letterSpacing: '0.1em', margin: 0,
        }}>
          GRIND OS
        </p>

        {/* Dot display */}
        <div
          className={shake ? 'pin-shake' : ''}
          style={{ display: 'flex', gap: '16px' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '14px', height: '14px', borderRadius: '50%',
                backgroundColor: i < input.length ? '#E63946' : '#1E1E2E',
                transition: 'background-color 0.1s',
              }}
            />
          ))}
        </div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%' }}>
          {KEYPAD.flat().map((key, idx) => {
            if (key === '') return <div key={idx} />;
            return (
              <button
                key={idx}
                onPointerDown={(e) => { e.preventDefault(); handleKey(key); }}
                style={{
                  height: '64px', borderRadius: '12px',
                  backgroundColor: '#13131A', border: '1px solid #1E1E2E',
                  color: '#F8F9FA', fontSize: key === 'del' ? '18px' : '24px',
                  fontFamily: key === 'del' ? 'Inter, sans-serif' : '"Bebas Neue", sans-serif',
                  letterSpacing: '0.05em', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                } as React.CSSProperties}
              >
                {key === 'del' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Exported so Settings can notify AuthGate when PIN changes without a reload
export function clearPinSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
