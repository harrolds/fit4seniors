import { useSyncExternalStore } from 'react';
import { getValue, setValue } from '../../shared/lib/storage';

export type SettingsPreferences = {
  fontScale: 'small' | 'default' | 'large';
  highContrast: boolean;
};

const STORAGE_KEY = 'settings.preferences.v1';

const defaultPreferences = (): SettingsPreferences => ({
  fontScale: 'default',
  highContrast: false,
});

const sanitizePreferences = (value: Partial<SettingsPreferences> | null | undefined): SettingsPreferences => {
  const safe = defaultPreferences();
  if (!value) return safe;

  const allowedScale: SettingsPreferences['fontScale'][] = ['small', 'default', 'large'];
  const fontScale = allowedScale.includes(value.fontScale as SettingsPreferences['fontScale'])
    ? (value.fontScale as SettingsPreferences['fontScale'])
    : safe.fontScale;

  return {
    fontScale,
    highContrast: Boolean(value.highContrast),
  };
};

const loadStoredPreferences = (): SettingsPreferences =>
  sanitizePreferences(getValue<SettingsPreferences | null>(STORAGE_KEY, null));

let state: SettingsPreferences = loadStoredPreferences();

type Listener = () => void;
const listeners = new Set<Listener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const applySettingsToDocument = (prefs: SettingsPreferences): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const scaleMap: Record<SettingsPreferences['fontScale'], number> = {
    small: 0.95,
    default: 1,
    large: 1.1,
  };

  root.style.setProperty('--f4s-font-scale', scaleMap[prefs.fontScale].toString());
  root.classList.toggle('f4s-contrast-high', Boolean(prefs.highContrast));
};

const setState = (next: SettingsPreferences) => {
  state = next;
  setValue(STORAGE_KEY, next);
  applySettingsToDocument(next);
  notify();
};

export const getSettingsState = (): SettingsPreferences => state;

export const saveSettings = (partial: Partial<SettingsPreferences>): SettingsPreferences => {
  const merged = sanitizePreferences({ ...state, ...partial });
  setState(merged);
  return merged;
};

export const ensureSettingsHydrated = (): SettingsPreferences => {
  const next = loadStoredPreferences();
  setState(next);
  return next;
};

export const subscribeSettings = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useSettingsState = (): SettingsPreferences =>
  useSyncExternalStore(subscribeSettings, () => state, () => state);

