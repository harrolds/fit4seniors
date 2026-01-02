import type { AuthAdapter } from './AuthAdapter';
import { SupabaseAuthAdapter } from './providers/SupabaseAuthAdapter';
import { supabaseAnonKey, supabaseUrl } from '../../config/runtimeEnv';

type AuthSession = { userId: string; email?: string } | null;

class NoopAuthAdapter implements AuthAdapter {
  private listeners = new Set<(session: AuthSession) => void>();

  async init(): Promise<void> {
    return;
  }

  async requestMagicLink(): Promise<void> {
    throw new Error('Auth provider is not configured.');
  }

  async getSession(): Promise<AuthSession> {
    return null;
  }

  onAuthStateChanged(cb: (session: AuthSession) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async signOut(): Promise<void> {
    this.listeners.forEach((cb) => cb(null));
  }
}

const fallbackAdapter = new NoopAuthAdapter();

const hasSupabaseUrl = typeof supabaseUrl === 'string' && supabaseUrl.trim().length > 0;
const hasSupabaseAnonKey = typeof supabaseAnonKey === 'string' && supabaseAnonKey.trim().length > 0;
const useSupabase = hasSupabaseUrl && hasSupabaseAnonKey;

const adapterName = useSupabase ? 'supabase' : 'noop';
console.info(`[auth] adapter=${adapterName} urlSet=${hasSupabaseUrl} keySet=${hasSupabaseAnonKey}`);

export const authAdapter: AuthAdapter = useSupabase
  ? new SupabaseAuthAdapter({ supabaseUrl, supabaseAnonKey })
  : fallbackAdapter;

