import { getItems, setItems } from '../../shared/lib/storage';
import type { TrainingIntensity } from '../../features/trainieren/catalog';

export interface CompletedSessionRecord {
  id: string;
  completedAt: number;
  moduleId: string;
  trainingId: string;
  trainingTitle: string;
  intensity: TrainingIntensity;
  durationMinPlanned: number;
  durationSecActual: number;
  paceCue?: string;
  stepsSummary?: string;
  notes?: string;
}

export const PROGRESS_STORAGE_KEY = 'progress:completedSessions';
const STORAGE_PREFIX = 'pwa-skeleton';
export const PROGRESS_STORAGE_EVENT_KEY = `${STORAGE_PREFIX}:${PROGRESS_STORAGE_KEY}`;

const sortSessions = (records: CompletedSessionRecord[]): CompletedSessionRecord[] => {
  return [...records].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
};

export const loadCompletedSessions = (): CompletedSessionRecord[] => {
  const records = getItems<CompletedSessionRecord>(PROGRESS_STORAGE_KEY);
  return sortSessions(records);
};

export const addCompletedSession = (record: CompletedSessionRecord): void => {
  const existing = getItems<CompletedSessionRecord>(PROGRESS_STORAGE_KEY);
  const deduped = existing.filter((item) => item.id !== record.id);
  const next = sortSessions([record, ...deduped]);
  setItems<CompletedSessionRecord>(PROGRESS_STORAGE_KEY, next);
};

export const getSessionById = (id: string): CompletedSessionRecord | null => {
  const records = loadCompletedSessions();
  return records.find((item) => item.id === id) ?? null;
};
