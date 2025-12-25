import { getValue, setValue } from '../../shared/lib/storage';
import type { TrainingVariantItem } from '../../features/trainieren/catalog';

export type MovementGoal = {
  sessionsPerWeek: number;
  minutesPerSession?: number;
};

export type PreferredFocus = 'cardio' | 'strength' | 'balance' | 'brain';
export type LevelKey = 'l1' | 'l2' | 'l3' | 'l4';

export type LevelInfo = {
  levelKey: LevelKey;
  labelKey: string;
  descriptionKey: string;
  nextThreshold: number | null;
  pointsToNext: number | null;
  nextLevelLabelKey: string | null;
};

export type ProfileMotorState = {
  movementGoal: MovementGoal;
  preferredFocus: PreferredFocus;
  levelDerived: LevelKey;
  totalPoints: number;
  localProfileCreatedAt?: string;
};

export type HistoryEntry = {
  completedAt?: number;
  durationSecActual?: number;
  durationMinPlanned?: number;
  intensity?: 'light' | 'medium' | 'heavy' | string;
  moduleId?: string;
  pointsEarned?: number;
  points?: number;
};

type GoalStatus = {
  status: 'onTrack' | 'near' | 'behind';
  goalSessions: number;
  weekSessions: number;
  remainingSessions: number;
};

const STORAGE_KEY = 'profile.motor.v1';

const LEVELS: Array<{ key: LevelKey; min: number; max?: number; labelKey: string; descriptionKey: string }> = [
  { key: 'l1', min: 0, max: 199, labelKey: 'profile.level.l1.label', descriptionKey: 'profile.level.l1.description' },
  { key: 'l2', min: 200, max: 599, labelKey: 'profile.level.l2.label', descriptionKey: 'profile.level.l2.description' },
  { key: 'l3', min: 600, max: 1199, labelKey: 'profile.level.l3.label', descriptionKey: 'profile.level.l3.description' },
  { key: 'l4', min: 1200, labelKey: 'profile.level.l4.label', descriptionKey: 'profile.level.l4.description' },
];

const clampSessions = (value: number | undefined, fallback: number): number => {
  if (!Number.isFinite(value ?? NaN)) return fallback;
  const safe = Math.max(1, Math.round(value as number));
  return Math.min(7, safe);
};

const clampMinutes = (value: number | undefined, fallback: number): number => {
  if (!Number.isFinite(value ?? NaN)) return fallback;
  const safe = Math.max(5, Math.round(value as number));
  return safe > 180 ? fallback : safe;
};

const normalizeDate = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString();
};

const fallbackPreferredFocus = (): PreferredFocus => 'cardio';

const readLegacyFocus = (): PreferredFocus | undefined => {
  const legacyProfile = getValue<{ focusPreference?: string; moveGoal?: string } | null>('profile.state.v1', null);
  const focus = legacyProfile?.focusPreference ?? legacyProfile?.moveGoal;
  switch (focus) {
    case 'balance_strength':
    case 'balance':
    case 'mobility':
      return 'balance';
    case 'endurance':
    case 'condition':
      return 'cardio';
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
    levelDerived: 'l1',
    totalPoints: 0,
    localProfileCreatedAt: new Date().toISOString(),
  };
};

const mapLegacyLevel = (level: unknown): LevelKey => {
  if (level === 'intermediate') return 'l2';
  if (level === 'active') return 'l3';
  return 'l1';
};

const normalizePreferredFocus = (value: unknown): PreferredFocus => {
  if (value === 'cardio' || value === 'strength' || value === 'balance' || value === 'brain') return value;
  const legacy = readLegacyFocus();
  return legacy ?? fallbackPreferredFocus();
};

const sanitizeProfile = (value: ProfileMotorState | null | undefined): ProfileMotorState => {
  const safe = defaultProfile();
  if (!value) return safe;
  const incoming = value as Partial<ProfileMotorState>;

  const movementGoal = incoming.movementGoal ?? safe.movementGoal;
  const preferredFocus = incoming.preferredFocus ?? safe.preferredFocus;
  const levelDerived = incoming.levelDerived ?? safe.levelDerived;
  const totalPoints = typeof incoming.totalPoints === 'number' && Number.isFinite(incoming.totalPoints) ? incoming.totalPoints : 0;

  return {
    movementGoal: {
      sessionsPerWeek: clampSessions(movementGoal?.sessionsPerWeek, safe.movementGoal.sessionsPerWeek),
      minutesPerSession: clampMinutes(
        movementGoal?.minutesPerSession,
        movementGoal?.minutesPerSession ? movementGoal.minutesPerSession : safe.movementGoal.minutesPerSession ?? 20,
      ),
    },
    preferredFocus: normalizePreferredFocus(preferredFocus),
    levelDerived: levelDerived === 'l1' || levelDerived === 'l2' || levelDerived === 'l3' || levelDerived === 'l4'
      ? levelDerived
      : mapLegacyLevel(levelDerived),
    totalPoints: Math.max(0, Math.round(totalPoints)),
    localProfileCreatedAt: normalizeDate(incoming.localProfileCreatedAt) ?? safe.localProfileCreatedAt,
  };
};

let profileCache: ProfileMotorState = sanitizeProfile(getValue<ProfileMotorState | null>(STORAGE_KEY, null));

const persist = (next: ProfileMotorState) => {
  profileCache = sanitizeProfile(next);
  setValue<ProfileMotorState>(STORAGE_KEY, profileCache);
};

export const getLevelFromPoints = (totalPoints: number): LevelInfo => {
  const safePoints = Number.isFinite(totalPoints) ? Math.max(0, Math.floor(totalPoints)) : 0;
  const index = LEVELS.findIndex(
    (candidate) => safePoints >= candidate.min && (candidate.max === undefined || safePoints <= candidate.max),
  );
  const level = LEVELS[index === -1 ? LEVELS.length - 1 : index];
  const nextLevel = LEVELS[(index === -1 ? LEVELS.length - 1 : index) + 1];

  const nextThreshold = level.max !== undefined ? level.max + 1 : null;
  const pointsToNext = nextThreshold !== null ? Math.max(nextThreshold - safePoints, 0) : null;

  return {
    levelKey: level.key,
    labelKey: level.labelKey,
    descriptionKey: level.descriptionKey,
    nextThreshold,
    pointsToNext,
    nextLevelLabelKey: nextLevel ? nextLevel.labelKey : null,
  };
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

const coercePoints = (entry: HistoryEntry | null | undefined): number => {
  if (!entry) return 0;
  const candidate = entry.pointsEarned ?? entry.points;
  if (!Number.isFinite(candidate ?? NaN)) return 0;
  return Math.max(0, Math.round(candidate as number));
};

export const deriveLevelFromHistory = (
  history: HistoryEntry[] | null | undefined,
  options?: { persist?: boolean },
): LevelKey => {
  const totalPoints = (history ?? []).reduce((acc, entry) => acc + coercePoints(entry), 0);
  const levelInfo = getLevelFromPoints(totalPoints);

  if (options?.persist !== false) {
    persist({ ...getProfile(), levelDerived: levelInfo.levelKey, totalPoints });
  }

  return levelInfo.levelKey;
};

const mapLevelToCategory = (level: LevelKey): 'beginner' | 'intermediate' | 'active' => {
  if (level === 'l1') return 'beginner';
  if (level === 'l2') return 'intermediate';
  return 'active';
};

const intensityScore = (intensity: string | undefined, level: LevelKey): number => {
  const category = mapLevelToCategory(level);
  if (intensity === 'heavy') {
    return category === 'active' ? 4 : category === 'intermediate' ? 3 : 1;
  }
  if (intensity === 'medium') {
    return category === 'beginner' ? 3 : 4;
  }
  return category === 'beginner' ? 4 : category === 'intermediate' ? 3 : 2;
};

const durationScore = (durationMin: number | undefined, level: LevelKey): number => {
  const category = mapLevelToCategory(level);
  if (!Number.isFinite(durationMin ?? NaN)) return 0;
  const value = durationMin as number;
  if (category === 'beginner') {
    return value <= 15 ? 3 : value <= 25 ? 2 : 1;
  }
  if (category === 'intermediate') {
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
): { items: TrainingVariantItem[]; recommendedIds: Set<string>; levelUsed: LevelKey } => {
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

