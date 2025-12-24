import { useSyncExternalStore } from 'react';
import { getValue, setValue } from '../../shared/lib/storage';

export type ProfileState = {
  displayName: string;
  memberSinceYear: string;
  moveGoal: 'condition' | 'strength' | 'balance' | 'social';
  fitnessLevel: 'starter' | 'intermediate' | 'advanced';
  focusPreference: 'balance_strength' | 'endurance' | 'mobility' | 'overall';
  trainingsCompleted: number;
  minutesSpent: number;
  weeksActive: number;
};

const STORAGE_KEY = 'profile.state.v1';

const defaultState = (): ProfileState => ({
  displayName: '',
  memberSinceYear: '2023',
  moveGoal: 'strength',
  fitnessLevel: 'intermediate',
  focusPreference: 'balance_strength',
  trainingsCompleted: 24,
  minutesSpent: 310,
  weeksActive: 8,
});

const coerceNumber = (value: unknown, fallback: number): number => {
  const num = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return num < 0 ? fallback : num;
};

const sanitizeProfile = (value: ProfileState | null | undefined): ProfileState => {
  if (!value) return defaultState();

  const safe = defaultState();
  const incoming = value as Partial<ProfileState>;

  return {
    displayName: typeof incoming.displayName === 'string' ? incoming.displayName : safe.displayName,
    memberSinceYear: typeof incoming.memberSinceYear === 'string' ? incoming.memberSinceYear : safe.memberSinceYear,
    moveGoal: ['condition', 'strength', 'balance', 'social'].includes(incoming.moveGoal as string)
      ? (incoming.moveGoal as ProfileState['moveGoal'])
      : safe.moveGoal,
    fitnessLevel: ['starter', 'intermediate', 'advanced'].includes(incoming.fitnessLevel as string)
      ? (incoming.fitnessLevel as ProfileState['fitnessLevel'])
      : safe.fitnessLevel,
    focusPreference: ['balance_strength', 'endurance', 'mobility', 'overall'].includes(incoming.focusPreference as string)
      ? (incoming.focusPreference as ProfileState['focusPreference'])
      : safe.focusPreference,
    trainingsCompleted: coerceNumber(incoming.trainingsCompleted, safe.trainingsCompleted),
    minutesSpent: coerceNumber(incoming.minutesSpent, safe.minutesSpent),
    weeksActive: coerceNumber(incoming.weeksActive, safe.weeksActive),
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
