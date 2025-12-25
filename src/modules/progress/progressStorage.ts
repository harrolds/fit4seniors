import { getItems, setItems } from '../../shared/lib/storage';
import { deriveLevelFromHistory } from '../../app/services/profileMotor';
import type { TrainingIntensity } from '../../features/trainieren/catalog';

export interface SessionSummary {
  kind: 'found_word';
  value?: string;
  success?: boolean;
}

export interface CompletedSessionRecord {
  id: string;
  completedAt: number;
  moduleId: string;
  trainingId: string;
  trainingTitle: string;
  intensity?: TrainingIntensity;
  durationMinPlanned?: number;
  durationSecActual: number;
  paceCue?: string;
  stepsSummary?: string;
  notes?: string;
  unitTitle?: string;
  completed?: boolean;
  summary?: SessionSummary;
  pointsEarned?: number;
  points?: number;
}

export const PROGRESS_STORAGE_KEY = 'progress:completedSessions';
const STORAGE_PREFIX = 'pwa-skeleton';
export const PROGRESS_STORAGE_EVENT_KEY = `${STORAGE_PREFIX}:${PROGRESS_STORAGE_KEY}`;

const sortSessions = (records: CompletedSessionRecord[]): CompletedSessionRecord[] => {
  return [...records].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
};

export const loadCompletedSessions = (): CompletedSessionRecord[] => {
  const records = getItems<CompletedSessionRecord>(PROGRESS_STORAGE_KEY);
  const sorted = sortSessions(records);
  deriveLevelFromHistory(sorted);
  return sorted;
};

export const getCompletedSessions = (): CompletedSessionRecord[] => loadCompletedSessions();

export const addCompletedSession = (record: CompletedSessionRecord): void => {
  const existing = getItems<CompletedSessionRecord>(PROGRESS_STORAGE_KEY);
  const deduped = existing.filter((item) => item.id !== record.id);
  const next = sortSessions([record, ...deduped]);
  setItems<CompletedSessionRecord>(PROGRESS_STORAGE_KEY, next);
  deriveLevelFromHistory(next);
};

export const getSessionById = (id: string): CompletedSessionRecord | null => {
  const records = loadCompletedSessions();
  return records.find((item) => item.id === id) ?? null;
};
