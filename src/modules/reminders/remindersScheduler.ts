import { useEffect, useRef } from 'react';
import { useNotifications } from '../../shared/lib/notifications';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import {
  addReminderNotification,
  createReminderNotification,
  getRemindersState,
  markNotificationRead,
  ReminderNotification,
  ReminderRule,
  setPermissionPrompted,
  setRemindersState,
} from './remindersStorage';

const CHECK_INTERVAL_MS = 60_000;

type SchedulerActions = {
  showToast: ReturnType<typeof useNotifications>['showToast'];
  navigateToReminders: () => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
};

const getDayIndex = (date: Date): number => date.getDay(); // 0-6, Sunday = 0

const parseRuleTime = (rule: ReminderRule, now: Date): number => {
  const [hours, minutes] = rule.time.split(':').map((value) => parseInt(value, 10));
  const scheduled = new Date(now);
  scheduled.setHours(Number.isFinite(hours) ? hours : 9, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return scheduled.getTime();
};

const buildNotification = (rule: ReminderRule): ReminderNotification =>
  createReminderNotification({
    titleKey: 'reminders.inbox.reminderTitle',
    bodyKey: 'reminders.inbox.reminderBody',
    tag: rule.id,
    linkedRoute: '/reminders',
    linkedRuleId: rule.id,
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
  const snapshot = getRemindersState();
  const todayIndex = getDayIndex(now);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  let rulesChanged = false;
  let nextRules = [...snapshot.rules];
  let permissionPrompted = snapshot.permissionPrompted ?? false;

  snapshot.rules.forEach((rule) => {
    if (!rule.time || !rule.days || rule.days.length === 0) return;
    if (!rule.days.includes(todayIndex)) return;
    if (rule.endDate) {
      const end = new Date(rule.endDate);
      if (!Number.isNaN(end.getTime()) && todayStart.getTime() > end.getTime()) {
        return;
      }
    }

    const scheduledTime = parseRuleTime(rule, now);
    const lastFiredAt = rule.lastFiredAt ? new Date(rule.lastFiredAt).getTime() : null;
    if (now.getTime() < scheduledTime) return;
    if (lastFiredAt && lastFiredAt >= scheduledTime) return;

    const notification = buildNotification(rule);
    addReminderNotification(notification);

    const { id } = notification;

    actions.showToast('reminders.toast.reminderFired', {
      kind: 'info',
      params: { time: rule.time },
      onClick: () => {
        markNotificationRead(id);
        actions.navigateToReminders();
      },
      notificationId: id,
    });

    if (snapshot.allowDuringSilent) {
      const systemShown = tryShowSystemNotification(notification, actions.translate);
      if (!systemShown && !permissionPrompted) {
        actions.showToast('reminders.toast.permissionNeeded', {
          kind: 'info',
        });
        setPermissionPrompted(true);
        permissionPrompted = true;
      }
    }

    if (rule.weekly) {
      nextRules = nextRules.map((item) =>
        item.id === rule.id ? { ...item, lastFiredAt: now.toISOString() } : item,
      );
    } else {
      nextRules = nextRules.filter((item) => item.id !== rule.id);
    }
    rulesChanged = true;
  });

  if (rulesChanged) {
    setRemindersState({
      rules: nextRules,
      allowDuringSilent: snapshot.allowDuringSilent,
      permissionPrompted,
    });
  }
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
