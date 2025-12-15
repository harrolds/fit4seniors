import { useSyncExternalStore } from 'react';
import { getValue, setValue } from '../../shared/lib/storage';

export type SettingsPreferences = {
  textScale: 'small' | 'default' | 'large';
  highContrast: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  language: 'de' | 'en';
};

const STORAGE_KEY = 'settings.preferences.v1';

type StoredSettings = Partial<SettingsPreferences> & { fontScale?: SettingsPreferences['textScale'] };

const defaultPreferences = (): SettingsPreferences => ({
  textScale: 'default',
  highContrast: false,
  soundEnabled: true,
  hapticsEnabled: true,
  language: 'de',
});

const sanitizePreferences = (value: StoredSettings | null | undefined): SettingsPreferences => {
  const safe = defaultPreferences();
  if (!value) return safe;

  const allowedScale: SettingsPreferences['textScale'][] = ['small', 'default', 'large'];
  const storedScale = value.textScale ?? value.fontScale;
  const textScale = allowedScale.includes(storedScale as SettingsPreferences['textScale'])
    ? (storedScale as SettingsPreferences['textScale'])
    : safe.textScale;

  const language = value.language === 'en' || value.language === 'de' ? value.language : safe.language;

  return {
    textScale,
    highContrast: Boolean(value.highContrast),
    soundEnabled: value.soundEnabled === undefined ? safe.soundEnabled : Boolean(value.soundEnabled),
    hapticsEnabled: value.hapticsEnabled === undefined ? safe.hapticsEnabled : Boolean(value.hapticsEnabled),
    language,
  };
};

export const getDefaultPreferences = (): SettingsPreferences => defaultPreferences();

const loadStoredPreferences = (): SettingsPreferences =>
  sanitizePreferences(getValue<StoredSettings | null>(STORAGE_KEY, null));

let state: SettingsPreferences = loadStoredPreferences();

type Listener = () => void;
const listeners = new Set<Listener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const applySettingsToDocument = (prefs: SettingsPreferences): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const scaleMap: Record<SettingsPreferences['textScale'], number> = {
    small: 0.95,
    default: 1,
    large: 1.1,
  };

  root.style.setProperty('--f4s-font-scale', scaleMap[prefs.textScale].toString());
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

