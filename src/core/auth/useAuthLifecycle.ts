import { useEffect, useRef } from 'react';
import { authAdapter } from './authClient';
import { setSession } from '../user/userStore';

type AuthSession = { userId: string; email?: string } | null;

const applyAuthToStore = (session: AuthSession) => {
  if (session) {
    setSession({
      auth: { status: 'authenticated', userId: session.userId, email: session.email },
    });
    return;
  }

  setSession({
    auth: { status: 'anonymous', userId: undefined, email: undefined },
  });
};

export const useAuthLifecycle = (): void => {
  const lastAuthRef = useRef<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const syncSession = (session: AuthSession) => {
      const fingerprint = session ? `${session.userId}:${session.email ?? ''}` : 'anonymous';
      if (lastAuthRef.current === fingerprint) return;
      lastAuthRef.current = fingerprint;
      applyAuthToStore(session);
    };

    const bootstrap = async () => {
      try {
        await authAdapter.init();
        if (cancelled) return;
        const initial = await authAdapter.getSession();
        if (cancelled) return;
        syncSession(initial);
        unsubscribe = authAdapter.onAuthStateChanged(syncSession);
      } catch (error) {
        console.warn('[auth] Failed to bootstrap auth', error);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
};

