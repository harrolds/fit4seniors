export interface AuthAdapter {
  init(): Promise<void>;
  requestMagicLink(email: string): Promise<void>;
  getSession(): Promise<{ userId: string; email?: string } | null>;
  onAuthStateChanged(cb: (session: { userId: string; email?: string } | null) => void): () => void;
  signOut(): Promise<void>;
}

