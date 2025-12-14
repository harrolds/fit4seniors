import React from 'react';
import { useI18n } from '../i18n';
import { Icon } from '../../ui/Icon';

export type NotificationKind = 'info' | 'success' | 'error';

export type Toast = {
  id: string;
  messageKey: string;
  kind?: NotificationKind;
  params?: Record<string, string | number>;
  onClick?: () => void;
  notificationId?: string;
  icon?: string;
  actionLabelKey?: string;
};

interface NotificationsContextValue {
  toasts: Toast[];
  showToast: (
    messageKey: string,
    options?: {
      kind?: NotificationKind;
      params?: Record<string, string | number>;
      durationMs?: number;
      onClick?: () => void;
      notificationId?: string;
      icon?: string;
      actionLabelKey?: string;
    }
  ) => void;
  dismissToast: (toastId: string) => void;
}

const NotificationsContext = React.createContext<NotificationsContextValue | undefined>(undefined);

const DEFAULT_DURATION_MS = 4000;

const generateToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timeoutsRef = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = React.useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));

    const timeoutId = timeoutsRef.current[toastId];
    if (timeoutId) {
      clearTimeout(timeoutId);
      delete timeoutsRef.current[toastId];
    }
  }, []);

  const showToast = React.useCallback(
    (
      messageKey: string,
      options?: {
        kind?: NotificationKind;
        params?: Record<string, string | number>;
        durationMs?: number;
        onClick?: () => void;
        notificationId?: string;
        icon?: string;
        actionLabelKey?: string;
      },
    ) => {
      const {
        kind = 'info',
        params,
        durationMs = DEFAULT_DURATION_MS,
        onClick,
        notificationId,
        icon,
        actionLabelKey,
      } = options ?? {};
      const toastId = generateToastId();

      const nextToast: Toast = {
        id: toastId,
        messageKey,
        kind,
        params,
        onClick,
        notificationId,
        icon,
        actionLabelKey,
      };

      setToasts((prev) => [...prev, nextToast]);

      const timeoutId = setTimeout(() => {
        removeToast(toastId);
      }, durationMs);

      timeoutsRef.current[toastId] = timeoutId;
    },
    [removeToast]
  );

  // The cleanup intentionally reads the latest timeoutsRef without re-running the effect.
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    return () => {
      const activeTimeouts = timeoutsRef.current;
      Object.values(activeTimeouts).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const value = React.useMemo<NotificationsContextValue>(
    () => ({
      toasts,
      showToast,
      dismissToast: removeToast,
    }),
    [toasts, showToast, removeToast]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = (): NotificationsContextValue => {
  const context = React.useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }

  return context;
};

const applyParams = (text: string, params?: Record<string, string | number>): string => {
  if (!params) {
    return text;
  }

  return Object.entries(params).reduce((result, [key, value]) => {
    const token = `{{${key}}}`;
    return result.split(token).join(String(value));
  }, text);
};

export const NotificationsHost: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();
  const { t } = useI18n();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="notifications-host" aria-live="polite" role="status">
      <div className="notifications-host__list">
        {toasts.map((toast) => {
          const kind = toast.kind ?? 'info';
          const message = applyParams(t(toast.messageKey), toast.params);
          const iconName = toast.icon ?? (kind === 'success' ? 'check_circle' : kind === 'error' ? 'error' : 'notifications');

          return (
            <div
              key={toast.id}
              className={`notifications-host__toast notifications-host__toast--${kind}${toast.onClick ? ' notifications-host__toast--clickable' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => {
                toast.onClick?.();
                dismissToast(toast.id);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toast.onClick?.();
                  dismissToast(toast.id);
                }
              }}
            >
              <div className="notifications-host__toast-icon">
                <Icon name={iconName} size={20} />
              </div>
              <div className="notifications-host__toast-content">
                <span className="notifications-host__toast-text">{message}</span>
                {toast.actionLabelKey ? (
                  <span className="notifications-host__toast-action">{t(toast.actionLabelKey)}</span>
                ) : null}
              </div>
              <button
                type="button"
                className="notifications-host__toast-close"
                aria-label={t('app.header.closeMenu')}
                onClick={(event) => {
                  event.stopPropagation();
                  dismissToast(toast.id);
                }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

