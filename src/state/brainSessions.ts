import { getItems, setItems } from '../shared/lib/storage';
import { addCompletedSession, type SessionSummary } from '../modules/progress/progressStorage';
import type { TrainingIntensity } from '../features/trainieren/catalog';

export interface BrainSession {
  exerciseId: string;
  category?: string;
  durationMinutes?: number;
  completed: boolean;
  timestamp: number;
}

export interface LogBrainSessionParams extends BrainSession {
  durationSecActual?: number;
  trainingTitle?: string;
  unitTitle?: string;
  summary?: SessionSummary;
  intensity?: TrainingIntensity;
}

export const BRAIN_SESSIONS_STORAGE_KEY = 'brain:sessions';
const STORAGE_PREFIX = 'pwa-skeleton';
export const BRAIN_SESSIONS_STORAGE_EVENT_KEY = `${STORAGE_PREFIX}:${BRAIN_SESSIONS_STORAGE_KEY}`;

const sortSessions = (sessions: BrainSession[]): BrainSession[] => {
  return [...sessions].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

export const loadBrainSessions = (): BrainSession[] => {
  const sessions = getItems<BrainSession>(BRAIN_SESSIONS_STORAGE_KEY);
  return sortSessions(sessions);
};

export const addBrainSession = (session: BrainSession): void => {
  const normalizedTimestamp = session.timestamp ?? Date.now();
  const normalizedSession: BrainSession = {
    ...session,
    timestamp: normalizedTimestamp,
  };

  const existing = getItems<BrainSession>(BRAIN_SESSIONS_STORAGE_KEY);
  const deduped = existing.filter(
    (item) => !(item.timestamp === normalizedSession.timestamp && item.exerciseId === normalizedSession.exerciseId),
  );
  const next = sortSessions([normalizedSession, ...deduped]);

  setItems<BrainSession>(BRAIN_SESSIONS_STORAGE_KEY, next);
};

export const logBrainSession = (params: LogBrainSessionParams): void => {
  const timestamp = params.timestamp ?? Date.now();
  const durationMinutes = params.durationMinutes ?? Math.max(1, Math.round((params.durationSecActual ?? 0) / 60));
  const durationSecActual = params.durationSecActual ?? Math.max(1, Math.round(durationMinutes * 60));

  const session: BrainSession = {
    exerciseId: params.exerciseId,
    category: params.category,
    durationMinutes,
    completed: params.completed,
    timestamp,
  };

  addBrainSession(session);

  addCompletedSession({
    id: `brain-${params.exerciseId}-${timestamp}`,
    completedAt: timestamp,
    moduleId: 'brain',
    trainingId: params.exerciseId,
    trainingTitle: params.trainingTitle ?? params.exerciseId,
    unitTitle: params.unitTitle ?? params.trainingTitle ?? params.exerciseId,
    intensity: params.intensity ?? 'medium',
    durationMinPlanned: 0,
    durationSecActual,
    summary: params.summary,
    completed: params.completed,
  });
};

