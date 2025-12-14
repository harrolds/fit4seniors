import { useSyncExternalStore } from 'react';
import { getItems, getValue, setItems, setValue } from '../../shared/lib/storage';

export type ReminderDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type ReminderRule = {
  id: string;
  days: number[];
  time: string;
  weekly: boolean;
  endDate: string | null;
  lastFiredAt?: string | null;
};

export type RemindersState = {
  rules: ReminderRule[];
  allowDuringSilent: boolean;
  permissionPrompted?: boolean;
};

export type ReminderKind = 'reminder' | 'info' | 'system';

export interface ReminderNotification {
  id: string;
  titleKey?: string;
  title?: string;
  bodyKey?: string;
  body?: string;
  createdAt: number;
  readAt?: number;
  kind?: ReminderKind;
  tag?: string;
  linkedRoute?: string;
  linkedRuleId?: string;
}

type RemindersSnapshot = RemindersState & {
  inbox: ReminderNotification[];
  unreadCount: number;
};

type LegacyReminderSettings = {
  times?: { id?: string; labelKey?: string; time?: string; lastFiredAt?: number }[];
  days?: ReminderDay[];
  allowDuringSilent?: boolean;
  permissionPrompted?: boolean;
};

const STATE_STORAGE_KEY = 'modules.reminders.settings';
const INBOX_STORAGE_KEY = 'modules.reminders.inbox';
const INBOX_MAX_ITEMS = 50;

const createId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const defaultState = (): RemindersState => ({
  rules: [],
  allowDuringSilent: false,
  permissionPrompted: false,
});

const isValidDay = (day: number): boolean => Number.isInteger(day) && day >= 0 && day <= 6;

const dayKeyToIndex = (key: ReminderDay): number => {
  const mapping: ReminderDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const index = mapping.indexOf(key);
  return index === -1 ? 1 : index;
};

const sanitizeTime = (time: string): string => (/^\d{2}:\d{2}$/.test(time) ? time : '');

const sanitizeRule = (rule: ReminderRule): ReminderRule => {
  const safeDays = Array.isArray(rule.days) ? rule.days.filter(isValidDay) : [];
  return {
    id: rule.id || createId(),
    days: safeDays,
    time: sanitizeTime(rule.time),
    weekly: Boolean(rule.weekly),
    endDate: rule.endDate ?? null,
    lastFiredAt: rule.lastFiredAt ?? null,
  };
};

const sanitizeRules = (rules: ReminderRule[] | null | undefined): ReminderRule[] => {
  if (!Array.isArray(rules)) return [];
  return rules
    .map((rule) => sanitizeRule(rule))
    .filter((rule) => rule.time !== '');
};

const migrateLegacySettings = (legacy: LegacyReminderSettings | null | undefined): RemindersState => {
  if (!legacy) return defaultState();

  const days = Array.isArray(legacy.days) ? legacy.days : [];
  const dayIndexes = days.map((d) => dayKeyToIndex(d)).filter(isValidDay);
  const rules =
    Array.isArray(legacy.times) && legacy.times.length > 0
      ? legacy.times
          .filter((slot) => slot && typeof slot.time === 'string' && sanitizeTime(slot.time) !== '')
          .map((slot) =>
            sanitizeRule({
              id: slot.id || createId(),
              days: dayIndexes,
              time: sanitizeTime(slot.time || ''),
              weekly: true,
              endDate: null,
              lastFiredAt: slot.lastFiredAt ? new Date(slot.lastFiredAt).toISOString() : null,
            }),
          )
      : [];

  return {
    rules,
    allowDuringSilent: Boolean(legacy.allowDuringSilent),
    permissionPrompted: Boolean(legacy.permissionPrompted),
  };
};

const sanitizeState = (value: RemindersState | LegacyReminderSettings | null | undefined): RemindersState => {
  if (!value) return defaultState();
  if ('times' in value || 'days' in value) {
    return migrateLegacySettings(value as LegacyReminderSettings);
  }
  const safeState = value as RemindersState;
  return {
    rules: sanitizeRules(safeState.rules),
    allowDuringSilent: Boolean(safeState.allowDuringSilent),
    permissionPrompted: Boolean(safeState.permissionPrompted),
  };
};

const sanitizeInbox = (items: ReminderNotification[] | null | undefined): ReminderNotification[] => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && item.id && item.createdAt)
    .map((item) => ({
      ...item,
      kind: item.kind ?? 'reminder',
    }))
    .slice(0, INBOX_MAX_ITEMS);
};

const loadState = (): RemindersState => sanitizeState(getValue<RemindersState | LegacyReminderSettings | null>(STATE_STORAGE_KEY, null));
const loadInbox = (): ReminderNotification[] => sanitizeInbox(getItems<ReminderNotification>(INBOX_STORAGE_KEY));

const computeUnread = (items: ReminderNotification[]): number => items.filter((item) => !item.readAt).length;

let state: RemindersSnapshot = (() => {
  const baseState = loadState();
  const inbox = loadInbox();
  const unreadCount = computeUnread(inbox);
  return { ...baseState, inbox, unreadCount };
})();

type Listener = () => void;
const listeners = new Set<Listener>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const persistState = (next: RemindersState) => {
  setValue<RemindersState>(STATE_STORAGE_KEY, {
    rules: sanitizeRules(next.rules),
    allowDuringSilent: Boolean(next.allowDuringSilent),
    permissionPrompted: Boolean(next.permissionPrompted),
  });
};

const persistInbox = (inbox: ReminderNotification[]) => {
  setItems<ReminderNotification>(INBOX_STORAGE_KEY, inbox);
};

const setState = (next: RemindersSnapshot) => {
  state = next;
  emit();
};

export const getRemindersState = (): RemindersSnapshot => state;

export const setRemindersState = (next: RemindersState): RemindersState => {
  const sanitized = sanitizeState(next);
  const snapshot: RemindersSnapshot = {
    ...state,
    ...sanitized,
  };
  persistState(sanitized);
  setState(snapshot);
  return sanitized;
};

const updateRules = (updater: (current: ReminderRule[]) => ReminderRule[]): ReminderRule[] => {
  const nextRules = sanitizeRules(updater(state.rules));
  const nextState: RemindersSnapshot = {
    ...state,
    rules: nextRules,
  };
  persistState({
    rules: nextRules,
    allowDuringSilent: state.allowDuringSilent,
    permissionPrompted: state.permissionPrompted,
  });
  setState(nextState);
  return nextRules;
};

export const addRule = (rule: ReminderRule): ReminderRule => {
  const safeRule = sanitizeRule(rule);
  updateRules((current) => [...current, safeRule]);
  return safeRule;
};

export const removeRule = (ruleId: string): void => {
  updateRules((current) => current.filter((rule) => rule.id !== ruleId));
};

export const markRuleFired = (ruleId: string, firedAt: string): void => {
  updateRules((current) =>
    current.map((rule) => (rule.id === ruleId ? { ...rule, lastFiredAt: firedAt } : rule)),
  );
};

export const setPermissionPrompted = (prompted: boolean): RemindersState => {
  return setRemindersState({
    rules: state.rules,
    allowDuringSilent: state.allowDuringSilent,
    permissionPrompted: prompted,
  });
};

const setInbox = (inbox: ReminderNotification[]) => {
  const safeInbox = sanitizeInbox(inbox).slice(0, INBOX_MAX_ITEMS);
  const unreadCount = computeUnread(safeInbox);
  const next: RemindersSnapshot = {
    ...state,
    inbox: safeInbox,
    unreadCount,
  };
  persistInbox(safeInbox);
  setState(next);
};

export const addReminderNotification = (notification: ReminderNotification): ReminderNotification => {
  const next = [notification, ...state.inbox].slice(0, INBOX_MAX_ITEMS);
  setInbox(next);
  return notification;
};

export const clearReminderNotifications = () => setInbox([]);

export const markNotificationRead = (id: string): void => {
  const next = state.inbox.map((item) =>
    item.id === id ? { ...item, readAt: item.readAt ?? Date.now() } : item,
  );
  setInbox(next);
};

export const markAllNotificationsRead = (): void => {
  if (state.unreadCount === 0) return;
  const next = state.inbox.map((item) => ({ ...item, readAt: item.readAt ?? Date.now() }));
  setInbox(next);
};

export const subscribeReminders = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useRemindersState = (): RemindersSnapshot =>
  useSyncExternalStore(subscribeReminders, () => state, () => state);

export const useReminderInbox = (): { inbox: ReminderNotification[]; unreadCount: number } => {
  const snapshot = useRemindersState();
  return {
    inbox: snapshot.inbox,
    unreadCount: snapshot.unreadCount,
  };
};

export const createReminderNotification = (
  overrides: Partial<ReminderNotification> & { titleKey?: string; bodyKey?: string },
): ReminderNotification => ({
  id: createId(),
  createdAt: Date.now(),
  kind: 'reminder',
  ...overrides,
});

export const ensureRemindersHydrated = (): void => {
  const baseState = loadState();
  const inbox = loadInbox();
  setState({
    ...baseState,
    inbox,
    unreadCount: computeUnread(inbox),
  });
};
