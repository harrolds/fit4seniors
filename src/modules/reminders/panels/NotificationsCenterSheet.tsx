import React from 'react';
import '../../../shared/panels/bottom-sheet.css';
import { useI18n } from '../../../shared/lib/i18n';
import { Badge } from '../../../shared/ui/Badge';
import { Icon } from '../../../shared/ui/Icon';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import {
  clearReminderNotifications,
  markNotificationRead,
  ReminderNotification,
  useReminderInbox,
} from '../remindersStorage';
import '../reminders.css';

const formatRelativeTime = (timestamp: number, t: (key: string, params?: Record<string, string | number>) => string): string => {
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((now - timestamp) / 60000));

  if (diffMinutes < 60) {
    return t('reminders.time.minutesAgo', { count: diffMinutes });
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return t('reminders.time.hoursAgo', { count: diffHours });
  }

  const diffDays = Math.floor(diffHours / 24);
  return t('reminders.time.daysAgo', { count: diffDays });
};

const resolveIcon = (kind?: ReminderNotification['kind']): string => {
  if (kind === 'info') return 'info';
  if (kind === 'system') return 'system_update';
  return 'notifications_active';
};

export const NotificationsCenterSheet: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const { inbox, unreadCount } = useReminderInbox();

  const handleClear = () => {
    clearReminderNotifications();
  };

  const handleSelect = (notification: ReminderNotification) => {
    markNotificationRead(notification.id);
    if (onClose) {
      onClose();
      requestAnimationFrame(() => goTo('/reminders'));
    } else {
      goTo('/reminders');
    }
  };

  return (
    <section className="bottom-sheet reminders-center">
      <header className="bottom-sheet__header reminders-center__header">
        <div className="reminders-center__title">
          <h2 className="bottom-sheet__title">{t('reminders.inbox.title')}</h2>
          {unreadCount > 0 ? (
            <Badge variant="accent" aria-label={t('reminders.inbox.unread', { count: unreadCount })}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          ) : null}
        </div>
        <button type="button" className="bottom-sheet__reset reminders-center__clear" onClick={handleClear}>
          {t('reminders.inbox.clearAll')}
        </button>
      </header>

      <div className="bottom-sheet__body reminders-center__body">
        <div className="reminders-center__list">
          {inbox.length === 0 ? (
            <p className="reminders-center__empty">{t('reminders.inbox.empty')}</p>
          ) : (
            inbox.map((item) => {
              const isUnread = !item.readAt;
              const title = item.titleKey ? t(item.titleKey) : item.title ?? '';
              const body = item.bodyKey ? t(item.bodyKey) : item.body ?? '';

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`reminders-center__item${isUnread ? ' reminders-center__item--new' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className={`reminders-center__icon reminders-center__icon--${item.kind ?? 'reminder'}`}>
                    <Icon name={resolveIcon(item.kind)} size={22} />
                  </div>
                  <div className="reminders-center__content">
                    <div className="reminders-center__row">
                      <h3 className="reminders-center__title-text">{title}</h3>
                      {isUnread ? (
                        <Badge variant="accent" className="reminders-center__pill">
                          {t('reminders.inbox.new')}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="reminders-center__body">{body}</p>
                    <span className="reminders-center__time">{formatRelativeTime(item.createdAt, t)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-secondary" onClick={onClose}>
          {t('reminders.inbox.close')}
        </button>
      </div>
    </section>
  );
};
