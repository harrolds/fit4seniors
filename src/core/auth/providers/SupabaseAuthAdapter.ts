import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type { AuthAdapter } from '../AuthAdapter';

type SupabaseAuthAdapterOptions = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

type AuthSession = { userId: string; email?: string } | null;

const mapSession = (session: Session | null): AuthSession => {
  if (!session?.user) return null;
  return {
    userId: session.user.id,
    email: session.user.email ?? undefined,
  };
};

export class SupabaseAuthAdapter implements AuthAdapter {
  private client: SupabaseClient | null = null;
  private unsubscribeSupabase?: () => void;
  private listeners = new Set<(session: AuthSession) => void>();
  private initialized = false;

  constructor(private readonly options: SupabaseAuthAdapterOptions) {}

  private notify(session: AuthSession) {
    for (const listener of this.listeners) {
      listener(session);
    }
  }

  private ensureClient(): SupabaseClient | null {
    if (this.client) return this.client;
    const { supabaseUrl, supabaseAnonKey } = this.options;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[auth] Supabase credentials missing; auth disabled.');
      return null;
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return this.client;
  }

  private async handleRedirectSession(client: SupabaseClient): Promise<void> {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const hasCode = Boolean(url.searchParams.get('code'));
    const hasAccessToken = url.hash.includes('access_token');
    if (!hasCode && !hasAccessToken) return;
    if (!hasCode) return;

    try {
      const { data, error } = await client.auth.exchangeCodeForSession(url.toString());
      if (error) {
        console.warn('[auth] Failed to exchange Supabase auth code', error);
        return;
      }
      this.notify(mapSession(data.session));
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    } catch (error) {
      console.warn('[auth] Redirect session handling failed', error);
    }
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const client = this.ensureClient();
    if (!client) return;

    if (!this.unsubscribeSupabase) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        this.notify(mapSession(session));
      });
      this.unsubscribeSupabase = () => data.subscription.unsubscribe();
    }

    await this.handleRedirectSession(client);
  }

  async requestMagicLink(email: string): Promise<void> {
    const client = this.ensureClient();
    if (!client) {
      throw new Error('Auth provider is not configured.');
    }

    const redirectTo = typeof location !== 'undefined' ? `${location.origin}/login/callback` : undefined;
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw error;
    }
  }

  async getSession(): Promise<AuthSession> {
    const client = this.ensureClient();
    if (!client) return null;

    const { data, error } = await client.auth.getSession();
    if (error) {
      throw error;
    }
    return mapSession(data.session);
  }

  onAuthStateChanged(cb: (session: AuthSession) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async signOut(): Promise<void> {
    const client = this.ensureClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) {
      throw error;
    }
    this.notify(null);
  }
}

