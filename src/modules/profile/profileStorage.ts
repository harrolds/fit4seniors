import { useSyncExternalStore } from 'react';
import { getValue, setValue } from '../../shared/lib/storage';
import type { PreferredFocus } from '../../app/services/profileMotor';

export type ProfileState = {
  displayName: string;
  sessionsPerWeek: number;
  preferredFocus: PreferredFocus;
  localProfileCreatedAt?: string;
  trainingsCompleted: number;
  minutesSpent: number;
  weeksActive: number;
  memberSinceYear?: string;
  legacyMoveGoal?: 'condition' | 'strength' | 'balance' | 'social';
  legacyFocusPreference?: 'balance_strength' | 'endurance' | 'mobility' | 'overall';
  legacyFitnessLevel?: 'starter' | 'intermediate' | 'advanced';
};

const STORAGE_KEY = 'profile.state.v1';

const defaultState = (): ProfileState => ({
  displayName: '',
  sessionsPerWeek: 3,
  preferredFocus: 'cardio',
  localProfileCreatedAt: undefined,
  trainingsCompleted: 24,
  minutesSpent: 310,
  weeksActive: 8,
  memberSinceYear: undefined,
  legacyMoveGoal: 'strength',
  legacyFocusPreference: 'balance_strength',
  legacyFitnessLevel: 'intermediate',
});

const coerceNumber = (value: unknown, fallback: number): number => {
  const num = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return num < 0 ? fallback : num;
};

const clampSessions = (value: unknown, fallback: number): number => {
  const num = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
  const bounded = Math.min(7, Math.max(1, num));
  return Number.isFinite(bounded) ? bounded : fallback;
};

const normalizeDate = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
};

const normalizePreferredFocus = (value: unknown): PreferredFocus => {
  if (value === 'cardio' || value === 'strength' || value === 'balance' || value === 'brain') {
    return value;
  }
  if (value === 'balance_strength' || value === 'mobility') return 'balance';
  if (value === 'endurance' || value === 'condition') return 'cardio';
  if (value === 'overall') return 'brain';
  if (value === 'strength' || value === 'muscle') return 'strength';
  return 'cardio';
};

const normalizeLegacyMoveGoal = (value: unknown): ProfileState['legacyMoveGoal'] => {
  if (value === 'condition' || value === 'strength' || value === 'balance' || value === 'social') {
    return value;
  }
  return undefined;
};

const normalizeLegacyFocus = (value: unknown): ProfileState['legacyFocusPreference'] => {
  if (value === 'balance_strength' || value === 'endurance' || value === 'mobility' || value === 'overall') {
    return value;
  }
  return undefined;
};

const normalizeLegacyFitness = (value: unknown): ProfileState['legacyFitnessLevel'] => {
  if (value === 'starter' || value === 'intermediate' || value === 'advanced') return value;
  return undefined;
};

const sanitizeProfile = (value: ProfileState | null | undefined): ProfileState => {
  if (!value) return defaultState();

  const safe = defaultState();
  const incoming = value as Partial<
    ProfileState & { moveGoal?: string; focusPreference?: string; fitnessLevel?: string; sessionsPerWeek?: number }
  >;

  const preferredFocus = normalizePreferredFocus(
    incoming.preferredFocus ?? incoming.legacyFocusPreference ?? incoming.focusPreference ?? incoming.legacyMoveGoal ?? incoming.moveGoal,
  );

  const sessionsPerWeek = clampSessions(incoming.sessionsPerWeek, safe.sessionsPerWeek);

  return {
    displayName: typeof incoming.displayName === 'string' ? incoming.displayName : safe.displayName,
    sessionsPerWeek,
    preferredFocus,
    localProfileCreatedAt: normalizeDate(incoming.localProfileCreatedAt),
    trainingsCompleted: coerceNumber(incoming.trainingsCompleted, safe.trainingsCompleted),
    minutesSpent: coerceNumber(incoming.minutesSpent, safe.minutesSpent),
    weeksActive: coerceNumber(incoming.weeksActive, safe.weeksActive),
    memberSinceYear: typeof incoming.memberSinceYear === 'string' ? incoming.memberSinceYear : safe.memberSinceYear,
    legacyMoveGoal: normalizeLegacyMoveGoal(incoming.legacyMoveGoal ?? incoming.moveGoal) ?? safe.legacyMoveGoal,
    legacyFocusPreference: normalizeLegacyFocus(incoming.legacyFocusPreference ?? incoming.focusPreference) ?? safe.legacyFocusPreference,
    legacyFitnessLevel: normalizeLegacyFitness(incoming.legacyFitnessLevel ?? incoming.fitnessLevel) ?? safe.legacyFitnessLevel,
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
  const createdAt = state.localProfileCreatedAt ?? new Date().toISOString();
  const merged = sanitizeProfile({ ...state, localProfileCreatedAt: createdAt, ...partial });
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
