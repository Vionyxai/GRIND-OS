import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AuthGate({ children }: { children: ReactNode }) {
  // Always render the app — sign-in happens silently in the background.
  // Cloud sync just won't work if credentials aren't available; the app
  // runs fully on localStorage either way.
  useAuth();
  return <>{children}</>;
}
