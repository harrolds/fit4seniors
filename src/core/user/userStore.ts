import { useSyncExternalStore } from 'react';
import type { UserSession } from './userSession';

const STORAGE_KEY = 'fit4seniors.session.v1';

const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return false;
  }
  try {
    const probeKey = `${STORAGE_KEY}.__probe__`;
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
};

const storageAvailable = isStorageAvailable();

const generateLocalUserId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const defaultSession = (): UserSession => ({
  localUserId: generateLocalUserId(),
  auth: { status: 'anonymous' },
  entitlements: { isPremium: false },
  admin: { isAdmin: false },
});

const readPersistedSession = (): UserSession => {
  if (!storageAvailable) {
    return defaultSession();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSession();
    }
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    if (!parsed || typeof parsed !== 'object') {
      return defaultSession();
    }
    return {
      ...defaultSession(),
      ...parsed,
      auth: { ...defaultSession().auth, ...(parsed.auth ?? {}) },
      entitlements: { ...defaultSession().entitlements, ...(parsed.entitlements ?? {}) },
      admin: { ...defaultSession().admin, ...(parsed.admin ?? {}) },
    };
  } catch {
    return defaultSession();
  }
};

let sessionCache: UserSession = readPersistedSession();

type SessionListener = (session: UserSession) => void;
const listeners = new Set<SessionListener>();

const notify = () => {
  for (const listener of listeners) {
    listener(sessionCache);
  }
};

const persistSession = (next: UserSession) => {
  sessionCache = next;
  if (storageAvailable) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Swallow storage errors to remain offline-first.
    }
  }
  notify();
};

const mergeSession = (base: UserSession, partial: Partial<UserSession>): UserSession => ({
  ...base,
  ...partial,
  auth: { ...base.auth, ...(partial.auth ?? {}) },
  entitlements: { ...base.entitlements, ...(partial.entitlements ?? {}) },
  admin: { ...base.admin, ...(partial.admin ?? {}) },
});

export const ensureLocalUserId = (): string => {
  if (!sessionCache.localUserId) {
    const next = { ...sessionCache, localUserId: generateLocalUserId() };
    persistSession(next);
  }
  if (storageAvailable) {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        persistSession(sessionCache);
      }
    } catch {
      // ignore storage write errors
    }
  }
  return sessionCache.localUserId;
};

export const getSession = (): UserSession => {
  if (!sessionCache.localUserId) {
    ensureLocalUserId();
  }
  return sessionCache;
};

export const setSession = (partial: Partial<UserSession>): UserSession => {
  const merged = mergeSession(sessionCache, partial);
  if (!merged.localUserId) {
    merged.localUserId = ensureLocalUserId();
  }
  persistSession(merged);
  return merged;
};

export const subscribeToSession = (listener: SessionListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useUserSession = (): UserSession => {
  return useSyncExternalStore(subscribeToSession, getSession, getSession);
};

