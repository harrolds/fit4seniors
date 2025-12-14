import { useEffect, useRef } from 'react';
import { useNotifications } from '../../shared/lib/notifications';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import {
  addReminderNotification,
  createReminderNotification,
  getRemindersState,
  markNotificationRead,
  recordSlotFired,
  ReminderDay,
  ReminderNotification,
  ReminderTimeSlot,
  setPermissionPrompted,
} from './remindersStorage';

const CHECK_INTERVAL_MS = 60_000;

type SchedulerActions = {
  showToast: ReturnType<typeof useNotifications>['showToast'];
  navigateToReminders: () => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
};

const getDayKey = (date: Date): ReminderDay => {
  const day = date.getDay(); // 0-6, Sunday = 0
  const keys: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const value = keys[day] ?? 'mon';
  return value as ReminderDay;
};

const parseSlotTime = (slot: ReminderTimeSlot, now: Date): number => {
  const [hours, minutes] = slot.time.split(':').map((value) => parseInt(value, 10));
  const scheduled = new Date(now);
  scheduled.setHours(Number.isFinite(hours) ? hours : 9, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return scheduled.getTime();
};

const shouldTriggerSlot = (slot: ReminderTimeSlot, now: Date): boolean => {
  const scheduledTime = parseSlotTime(slot, now);
  if (now.getTime() < scheduledTime) return false;
  if (slot.lastFiredAt && slot.lastFiredAt >= scheduledTime) return false;
  return true;
};

const buildNotification = (slot: ReminderTimeSlot): ReminderNotification =>
  createReminderNotification({
    titleKey: 'reminders.inbox.reminderTitle',
    bodyKey: 'reminders.inbox.reminderBody',
    tag: slot.id,
    linkedRoute: '/reminders',
    linkedSlotId: slot.id,
  });

const tryShowSystemNotification = (
  notification: ReminderNotification,
  translate: SchedulerActions['translate'],
): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const title = notification.title ?? (notification.titleKey ? translate(notification.titleKey) : '');
  const body = notification.body ?? (notification.bodyKey ? translate(notification.bodyKey) : '');

  new Notification(title, {
    body,
  });
  return true;
};

const runDueCheck = (actions: SchedulerActions) => {
  const now = new Date();
  const { settings } = getRemindersState();
  const todayKey = getDayKey(now);

  if (!settings.days.includes(todayKey)) {
    return;
  }

  settings.times.forEach((slot) => {
    if (!shouldTriggerSlot(slot, now)) return;

    const notification = buildNotification(slot);
    addReminderNotification(notification);
    recordSlotFired(slot.id, now.getTime());

    const { id } = notification;

    actions.showToast('reminders.toast.reminderDue', {
      kind: 'info',
      params: { time: slot.time },
      onClick: () => {
        markNotificationRead(id);
        actions.navigateToReminders();
      },
      notificationId: id,
    });

    if (settings.allowDuringSilent) {
      const systemShown = tryShowSystemNotification(notification, actions.translate);
      if (!systemShown && !settings.permissionPrompted) {
        actions.showToast('reminders.toast.permissionNeeded', {
          kind: 'info',
        });
        setPermissionPrompted(true);
      }
    }
  });
};

let intervalId: number | null = null;
let subscriberCount = 0;
let latestActions: SchedulerActions | null = null;

const stopSchedulerInternal = () => {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
};

const ensureSchedulerRunning = () => {
  if (!latestActions) return;
  if (intervalId !== null) return;
  runDueCheck(latestActions);
  intervalId = window.setInterval(() => {
    if (latestActions) {
      runDueCheck(latestActions);
    }
  }, CHECK_INTERVAL_MS);
};

const subscribeScheduler = (actions: SchedulerActions) => {
  latestActions = actions;
  subscriberCount += 1;
  ensureSchedulerRunning();
};

const unsubscribeScheduler = () => {
  subscriberCount = Math.max(0, subscriberCount - 1);
  if (subscriberCount === 0) {
    stopSchedulerInternal();
    latestActions = null;
  }
};

export const useRemindersScheduler = (): void => {
  const { showToast } = useNotifications();
  const { goTo } = useNavigation();
  const { t } = useI18n();
  const actionsRef = useRef<SchedulerActions>({
    showToast,
    navigateToReminders: () => goTo('/reminders'),
    translate: t,
  });

  actionsRef.current = {
    showToast,
    navigateToReminders: () => goTo('/reminders'),
    translate: t,
  };

  useEffect(() => {
    subscribeScheduler(actionsRef.current);
    return () => {
      unsubscribeScheduler();
    };
  }, []);

  useEffect(() => {
    latestActions = actionsRef.current;
    ensureSchedulerRunning();
  }, [showToast, goTo, t]);
};
