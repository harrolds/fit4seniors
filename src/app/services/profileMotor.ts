import { getValue, setValue } from '../../shared/lib/storage';
import type { TrainingVariantItem } from '../../features/trainieren/catalog';

export type MovementGoal = {
  sessionsPerWeek: number;
  minutesPerSession?: number;
};

export type PreferredFocus = 'cardio' | 'strength' | 'balance' | 'brain';
export type DerivedLevel = 'beginner' | 'intermediate' | 'active';

export type ProfileMotorState = {
  movementGoal: MovementGoal;
  preferredFocus: PreferredFocus;
  levelDerived: DerivedLevel;
};

export type HistoryEntry = {
  completedAt?: number;
  durationSecActual?: number;
  durationMinPlanned?: number;
  intensity?: 'light' | 'medium' | 'heavy' | string;
  moduleId?: string;
};

type GoalStatus = {
  status: 'onTrack' | 'near' | 'behind';
  goalSessions: number;
  weekSessions: number;
  remainingSessions: number;
};

const STORAGE_KEY = 'profile.motor.v1';
const FOUR_WEEKS_MS = 1000 * 60 * 60 * 24 * 28;

const clampSessions = (value: number | undefined, fallback: number): number => {
  if (!Number.isFinite(value ?? NaN)) return fallback;
  const safe = Math.max(1, Math.round(value as number));
  return safe > 21 ? fallback : safe;
};

const clampMinutes = (value: number | undefined, fallback: number): number => {
  if (!Number.isFinite(value ?? NaN)) return fallback;
  const safe = Math.max(5, Math.round(value as number));
  return safe > 180 ? fallback : safe;
};

const fallbackPreferredFocus = (): PreferredFocus => 'cardio';

const readLegacyFocus = (): PreferredFocus | undefined => {
  const legacyProfile = getValue<{ focusPreference?: string; moveGoal?: string } | null>('profile.state.v1', null);
  const focus = legacyProfile?.focusPreference ?? legacyProfile?.moveGoal;
  switch (focus) {
    case 'balance_strength':
    case 'balance':
      return 'balance';
    case 'endurance':
    case 'condition':
      return 'cardio';
    case 'mobility':
      return 'balance';
    case 'overall':
      return 'brain';
    case 'strength':
    case 'muscle':
      return 'strength';
    default:
      return undefined;
  }
};

const defaultProfile = (): ProfileMotorState => {
  const legacyFocus = readLegacyFocus();
  return {
    movementGoal: { sessionsPerWeek: 3, minutesPerSession: 20 },
    preferredFocus: legacyFocus ?? fallbackPreferredFocus(),
    levelDerived: 'beginner',
  };
};

const sanitizeProfile = (value: ProfileMotorState | null | undefined): ProfileMotorState => {
  const safe = defaultProfile();
  if (!value) return safe;
  const incoming = value as Partial<ProfileMotorState>;

  const movementGoal = incoming.movementGoal ?? safe.movementGoal;
  const preferredFocus = incoming.preferredFocus ?? safe.preferredFocus;
  const levelDerived = incoming.levelDerived ?? safe.levelDerived;

  return {
    movementGoal: {
      sessionsPerWeek: clampSessions(movementGoal?.sessionsPerWeek, safe.movementGoal.sessionsPerWeek),
      minutesPerSession: clampMinutes(
        movementGoal?.minutesPerSession,
        movementGoal?.minutesPerSession ? movementGoal.minutesPerSession : safe.movementGoal.minutesPerSession ?? 20,
      ),
    },
    preferredFocus:
      preferredFocus === 'cardio' || preferredFocus === 'strength' || preferredFocus === 'balance' || preferredFocus === 'brain'
        ? preferredFocus
        : safe.preferredFocus,
    levelDerived: levelDerived === 'intermediate' || levelDerived === 'active' ? levelDerived : 'beginner',
  };
};

let profileCache: ProfileMotorState = sanitizeProfile(getValue<ProfileMotorState | null>(STORAGE_KEY, null));

const persist = (next: ProfileMotorState) => {
  profileCache = sanitizeProfile(next);
  setValue<ProfileMotorState>(STORAGE_KEY, profileCache);
};

export const getProfile = (): ProfileMotorState => profileCache;

export const setMovementGoal = (movementGoal: Partial<MovementGoal>): ProfileMotorState => {
  const current = getProfile();
  const next: ProfileMotorState = {
    ...current,
    movementGoal: {
      sessionsPerWeek: clampSessions(
        movementGoal.sessionsPerWeek ?? current.movementGoal.sessionsPerWeek,
        current.movementGoal.sessionsPerWeek,
      ),
      minutesPerSession: clampMinutes(
        movementGoal.minutesPerSession ?? current.movementGoal.minutesPerSession ?? 20,
        current.movementGoal.minutesPerSession ?? 20,
      ),
    },
  };
  persist(next);
  return next;
};

export const setPreferredFocus = (preferredFocus: PreferredFocus): ProfileMotorState => {
  const current = getProfile();
  const next: ProfileMotorState = {
    ...current,
    preferredFocus,
  };
  persist(next);
  return next;
};

const resolveStartOfWeek = (now: Date): Date => {
  const result = new Date(now);
  const day = result.getDay(); // 0 Sunday
  const diff = day === 0 ? -6 : 1 - day;
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + diff);
  return result;
};

const resolveEndOfWeek = (start: Date): Date => {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const deriveLevelFromHistory = (
  history: HistoryEntry[] | null | undefined,
  options?: { persist?: boolean },
): DerivedLevel => {
  const now = Date.now();
  const windowStart = now - FOUR_WEEKS_MS;
  const recentSessions = (history ?? []).filter((entry) => (entry.completedAt ?? 0) >= windowStart);
  const sessionCount = recentSessions.length;

  let derived: DerivedLevel;
  if (sessionCount < 6) {
    derived = 'beginner';
  } else if (sessionCount <= 15) {
    derived = 'intermediate';
  } else {
    derived = 'active';
  }

  if (options?.persist !== false) {
    persist({ ...getProfile(), levelDerived: derived });
  }

  return derived;
};

const intensityScore = (intensity: string | undefined, level: DerivedLevel): number => {
  if (intensity === 'heavy') {
    return level === 'active' ? 4 : level === 'intermediate' ? 3 : 1;
  }
  if (intensity === 'medium') {
    return level === 'beginner' ? 3 : 4;
  }
  return level === 'beginner' ? 4 : level === 'intermediate' ? 3 : 2;
};

const durationScore = (durationMin: number | undefined, level: DerivedLevel): number => {
  if (!Number.isFinite(durationMin ?? NaN)) return 0;
  const value = durationMin as number;
  if (level === 'beginner') {
    return value <= 15 ? 3 : value <= 25 ? 2 : 1;
  }
  if (level === 'intermediate') {
    if (value <= 15) return 2;
    if (value <= 30) return 3;
    return 2;
  }
  // active
  if (value <= 15) return 1;
  if (value <= 30) return 3;
  return 4;
};

const focusScore = (moduleId: string | undefined, preferredFocus: PreferredFocus): number => {
  if (!moduleId) return 0;
  const focusToModules: Record<PreferredFocus, string[]> = {
    cardio: ['cardio'],
    strength: ['muskel', 'muscle'],
    balance: ['balance_flex', 'balance'],
    brain: ['brain'],
  };
  return focusToModules[preferredFocus]?.includes(moduleId) ? 2 : 0;
};

export const getRecommendationsForTrainingList = (
  trainings: TrainingVariantItem[],
  profile?: ProfileMotorState,
  history?: HistoryEntry[],
): { items: TrainingVariantItem[]; recommendedIds: Set<string>; levelUsed: DerivedLevel } => {
  const baseProfile = sanitizeProfile(profile ?? getProfile());
  const level = deriveLevelFromHistory(history, { persist: false }) ?? baseProfile.levelDerived;

  const scored = trainings.map((item) => {
    const intScore = intensityScore(item.intensity, level);
    const durScore = durationScore(item.durationMin, level);
    const prefScore = focusScore(item.moduleId, baseProfile.preferredFocus);
    const total = intScore + durScore + prefScore;
    const recommended = intScore >= 3 && durScore >= 2;
    return { item, total, recommended };
  });

  const recommendedIds = new Set(scored.filter((s) => s.recommended).map((s) => s.item.id));
  const items = scored
    .sort((a, b) => b.total - a.total || (b.item.durationMin ?? 0) - (a.item.durationMin ?? 0))
    .map((entry) => entry.item);

  return { items, recommendedIds, levelUsed: level };
};

export const getGoalStatus = (
  history?: HistoryEntry[] | null,
  profileOverride?: ProfileMotorState,
): GoalStatus => {
  const profile = sanitizeProfile(profileOverride ?? getProfile());
  const startOfWeek = resolveStartOfWeek(new Date());
  const endOfWeek = resolveEndOfWeek(startOfWeek);
  const weekSessions = (history ?? []).filter((entry) => {
    if (!entry.completedAt) return false;
    const date = new Date(entry.completedAt);
    return date >= startOfWeek && date <= endOfWeek;
  }).length;
  const goalSessions = clampSessions(profile.movementGoal.sessionsPerWeek, profile.movementGoal.sessionsPerWeek);
  const remainingSessions = Math.max(goalSessions - weekSessions, 0);

  let status: GoalStatus['status'] = 'behind';
  if (weekSessions >= goalSessions) {
    status = 'onTrack';
  } else if (weekSessions === goalSessions - 1) {
    status = 'near';
  }

  return { status, goalSessions, weekSessions, remainingSessions };
};


