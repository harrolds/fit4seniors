import { useSyncExternalStore } from 'react';
import { getValue, setValue } from '../../shared/lib/storage';

export type AccessibilityPreferences = {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
};

export type ProfileState = {
  displayName: string;
  memberSinceYear: string;
  ageCategory: '60_65' | '66_70' | '71_75' | '75_plus';
  moveGoal: 'condition' | 'strength' | 'balance' | 'social';
  fitnessLevel: 'starter' | 'intermediate' | 'advanced';
  gender: 'male' | 'female' | 'unspecified';
  focusPreference: 'balance_strength' | 'endurance' | 'mobility' | 'overall';
  healthFocus: 'heart_bp' | 'mobility' | 'vitals';
  weeklyGoalFrequency: number;
  sessionDurationMinutes: number;
  trainingsCompleted: number;
  minutesSpent: number;
  weeksActive: number;
  accessibility: AccessibilityPreferences;
};

const STORAGE_KEY = 'profile.state.v1';

const defaultState = (): ProfileState => ({
  displayName: '',
  memberSinceYear: '2023',
  ageCategory: '66_70',
  moveGoal: 'strength',
  fitnessLevel: 'intermediate',
  gender: 'male',
  focusPreference: 'balance_strength',
  healthFocus: 'heart_bp',
  weeklyGoalFrequency: 3,
  sessionDurationMinutes: 20,
  trainingsCompleted: 24,
  minutesSpent: 310,
  weeksActive: 8,
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
  },
});

const coerceNumber = (value: unknown, fallback: number): number => {
  const num = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return num < 0 ? fallback : num;
};

const sanitizeAccessibility = (value: AccessibilityPreferences | null | undefined): AccessibilityPreferences => {
  if (!value) {
    return { largeText: false, highContrast: false, reduceMotion: false };
  }
  return {
    largeText: Boolean(value.largeText),
    highContrast: Boolean(value.highContrast),
    reduceMotion: Boolean(value.reduceMotion),
  };
};

const sanitizeProfile = (value: ProfileState | null | undefined): ProfileState => {
  if (!value) return defaultState();

  const safe = defaultState();
  const incoming = value as Partial<ProfileState>;

  return {
    displayName: typeof incoming.displayName === 'string' ? incoming.displayName : safe.displayName,
    memberSinceYear: typeof incoming.memberSinceYear === 'string' ? incoming.memberSinceYear : safe.memberSinceYear,
    ageCategory: ['60_65', '66_70', '71_75', '75_plus'].includes(incoming.ageCategory as string)
      ? (incoming.ageCategory as ProfileState['ageCategory'])
      : safe.ageCategory,
    moveGoal: ['condition', 'strength', 'balance', 'social'].includes(incoming.moveGoal as string)
      ? (incoming.moveGoal as ProfileState['moveGoal'])
      : safe.moveGoal,
    fitnessLevel: ['starter', 'intermediate', 'advanced'].includes(incoming.fitnessLevel as string)
      ? (incoming.fitnessLevel as ProfileState['fitnessLevel'])
      : safe.fitnessLevel,
    gender: ['male', 'female', 'unspecified'].includes(incoming.gender as string)
      ? (incoming.gender as ProfileState['gender'])
      : safe.gender,
    focusPreference: ['balance_strength', 'endurance', 'mobility', 'overall'].includes(incoming.focusPreference as string)
      ? (incoming.focusPreference as ProfileState['focusPreference'])
      : safe.focusPreference,
    healthFocus: ['heart_bp', 'mobility', 'vitals'].includes(incoming.healthFocus as string)
      ? (incoming.healthFocus as ProfileState['healthFocus'])
      : safe.healthFocus,
    weeklyGoalFrequency: coerceNumber(incoming.weeklyGoalFrequency, safe.weeklyGoalFrequency),
    sessionDurationMinutes: coerceNumber(incoming.sessionDurationMinutes, safe.sessionDurationMinutes),
    trainingsCompleted: coerceNumber(incoming.trainingsCompleted, safe.trainingsCompleted),
    minutesSpent: coerceNumber(incoming.minutesSpent, safe.minutesSpent),
    weeksActive: coerceNumber(incoming.weeksActive, safe.weeksActive),
    accessibility: sanitizeAccessibility(incoming.accessibility),
  };
};

const loadStoredState = (): ProfileState => sanitizeProfile(getValue<ProfileState | null>(STORAGE_KEY, null));

let state: ProfileState = loadStoredState();

type Listener = () => void;
const listeners = new Set<Listener>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setState = (next: ProfileState) => {
  state = next;
  emit();
};

const persistState = (next: ProfileState) => {
  setValue<ProfileState>(STORAGE_KEY, next);
};

export const getProfileState = (): ProfileState => state;

export const loadProfile = (): ProfileState => {
  const next = loadStoredState();
  setState(next);
  return next;
};

export const saveProfile = (partial: Partial<ProfileState>): ProfileState => {
  const merged = sanitizeProfile({ ...state, ...partial });
  persistState(merged);
  setState(merged);
  return merged;
};

export const subscribeProfile = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useProfileState = (): ProfileState =>
  useSyncExternalStore(subscribeProfile, () => state, () => state);

export const ensureProfileHydrated = (): void => {
  const next = loadStoredState();
  setState(next);
};

export const getDisplayName = (fallback = ''): string => {
  const safe = (state.displayName || '').trim();
  if (safe.length === 0) {
    return fallback;
  }
  return safe;
};

export const useDisplayName = (fallback = ''): string => {
  const snapshot = useProfileState();
  const safe = (snapshot.displayName || '').trim();
  if (safe.length === 0) {
    return fallback;
  }
  return safe;
};
