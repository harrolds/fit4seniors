import { useSyncExternalStore } from 'react';
import { getItems, getValue, setItems, setValue } from '../../shared/lib/storage';

export type ReminderDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ReminderTimeSlot {
  id: string;
  labelKey: string;
  time: string;
  lastFiredAt?: number;
}

export interface ReminderSettings {
  times: ReminderTimeSlot[];
  days: ReminderDay[];
  allowDuringSilent: boolean;
  permissionPrompted?: boolean;
}

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
  linkedSlotId?: string;
}

export interface RemindersState {
  settings: ReminderSettings;
  inbox: ReminderNotification[];
  unreadCount: number;
}

const SETTINGS_STORAGE_KEY = 'modules.reminders.settings';
const INBOX_STORAGE_KEY = 'modules.reminders.inbox';
const INBOX_MAX_ITEMS = 50;
const MAX_TIME_SLOTS = 6;

const createId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const defaultSettings = (): ReminderSettings => ({
  times: [
    { id: 'reminder-morning', labelKey: 'reminders.defaults.morning', time: '09:00' },
    { id: 'reminder-afternoon', labelKey: 'reminders.defaults.afternoon', time: '14:30' },
  ],
  days: ['mon', 'tue', 'wed', 'thu', 'fri'],
  allowDuringSilent: false,
  permissionPrompted: false,
});

const isValidDay = (day: string): day is ReminderDay =>
  ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(day);

const sanitizeTime = (time: string): string => {
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  return '09:00';
};

const sanitizeSettings = (value: ReminderSettings | null | undefined): ReminderSettings => {
  const fallback = defaultSettings();
  if (!value) return fallback;

  const times = Array.isArray(value.times) && value.times.length > 0 ? value.times : fallback.times;
  const sanitizedTimes = times
    .filter((slot) => slot && typeof slot.time === 'string')
    .map((slot) => ({
      id: slot.id || createId(),
      labelKey: slot.labelKey || 'reminders.defaults.morning',
      time: sanitizeTime(slot.time),
      lastFiredAt: slot.lastFiredAt,
    }))
    .slice(0, MAX_TIME_SLOTS);

  const ensureMinimumTimes =
    sanitizedTimes.length >= 2 ? sanitizedTimes : [...sanitizedTimes, ...fallback.times].slice(0, 2);

  const days = Array.isArray(value.days) ? value.days.filter(isValidDay) : fallback.days;
  const safeDays = days.length > 0 ? days : fallback.days;

  return {
    times: ensureMinimumTimes,
    days: safeDays,
    allowDuringSilent: Boolean(value.allowDuringSilent),
    permissionPrompted: Boolean(value.permissionPrompted),
  };
};

const sanitizeInbox = (
  items: ReminderNotification[] | null | undefined,
): ReminderNotification[] => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && item.id && item.createdAt)
    .map((item) => ({
      ...item,
      kind: item.kind ?? 'reminder',
    }))
    .slice(0, INBOX_MAX_ITEMS);
};

const loadSettings = (): ReminderSettings => sanitizeSettings(getValue<ReminderSettings | null>(SETTINGS_STORAGE_KEY, null));
const loadInbox = (): ReminderNotification[] => sanitizeInbox(getItems<ReminderNotification>(INBOX_STORAGE_KEY));

let state: RemindersState = (() => {
  const settings = loadSettings();
  const inbox = loadInbox();
  const unreadCount = inbox.filter((item) => !item.readAt).length;
  return { settings, inbox, unreadCount };
})();

type Listener = () => void;
const listeners = new Set<Listener>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const persistSettings = (settings: ReminderSettings) => {
  setValue<ReminderSettings>(SETTINGS_STORAGE_KEY, settings);
};

const persistInbox = (inbox: ReminderNotification[]) => {
  setItems<ReminderNotification>(INBOX_STORAGE_KEY, inbox);
};

const setState = (next: RemindersState) => {
  state = next;
  emit();
};

export const getRemindersState = (): RemindersState => state;

export const updateReminderSettings = (settings: ReminderSettings): ReminderSettings => {
  const sanitized = sanitizeSettings(settings);
  const next: RemindersState = {
    ...state,
    settings: sanitized,
  };
  persistSettings(sanitized);
  setState(next);
  return sanitized;
};

export const upsertReminderTimes = (times: ReminderTimeSlot[]): ReminderSettings => {
  const merged: ReminderSettings = {
    ...state.settings,
    times: times.map((slot) => ({
      ...slot,
      time: sanitizeTime(slot.time),
      id: slot.id || createId(),
    })),
  };
  return updateReminderSettings(merged);
};

export const updateReminderDays = (days: ReminderDay[]): ReminderSettings => {
  const merged: ReminderSettings = {
    ...state.settings,
    days: days.filter(isValidDay),
  };
  return updateReminderSettings(merged);
};

export const setPermissionPrompted = (prompted: boolean): ReminderSettings => {
  const merged: ReminderSettings = {
    ...state.settings,
    permissionPrompted: prompted,
  };
  return updateReminderSettings(merged);
};

const computeUnread = (items: ReminderNotification[]): number => items.filter((item) => !item.readAt).length;

const setInbox = (inbox: ReminderNotification[]) => {
  const safeInbox = sanitizeInbox(inbox).slice(0, INBOX_MAX_ITEMS);
  const unreadCount = computeUnread(safeInbox);
  const next: RemindersState = {
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

export const recordSlotFired = (slotId: string, firedAt: number): void => {
  const nextTimes = state.settings.times.map((slot) =>
    slot.id === slotId ? { ...slot, lastFiredAt: firedAt } : slot,
  );
  upsertReminderTimes(nextTimes);
};

export const subscribeReminders = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useRemindersState = (): RemindersState =>
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
  const settings = loadSettings();
  const inbox = loadInbox();
  setState({
    settings,
    inbox,
    unreadCount: computeUnread(inbox),
  });
};
