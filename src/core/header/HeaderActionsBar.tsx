import React from 'react';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../shared/lib/i18n';
import type { ScreenAction } from '../screenConfig';
import { Icon } from '../../shared/ui/Icon';
import { useReminderInbox } from '../../modules/reminders';

const iconMap: Record<string, string> = {
  notifications: 'notifications',
  settings: 'settings',
  back: 'arrow_back',
  menu: 'more_horiz',
};

const resolveIconName = (action: ScreenAction): string => {
  if (action.icon && iconMap[action.icon]) {
    return iconMap[action.icon];
  }
  return 'more_horiz';
};

export const HeaderActionsBar: React.FC<{
  actions?: ScreenAction[];
  onAction: (action: ScreenAction) => void;
}> = ({ actions, onAction }) => {
  const { t } = useI18n();
  const { unreadCount } = useReminderInbox();

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="app-shell__actions-bar">
      {actions.map((action) => {
        const isNotificationAction = action.id === 'openNotifications' || action.icon === 'notifications';
        const showBadge = isNotificationAction && unreadCount > 0;
        const badgeValue = unreadCount > 99 ? '99+' : unreadCount;

        return (
          <div key={action.id} className={isNotificationAction ? 'header-action' : undefined}>
            <Button
              type="button"
              onClick={() => onAction(action)}
              aria-label={t(action.labelKey)}
              className="app-shell__icon-button"
              variant="ghost"
              style={{ width: 36, height: 36, padding: 0 }}
            >
              <Icon name={resolveIconName(action)} size={24} />
            </Button>
            {showBadge ? <span className="header-action__badge">{badgeValue}</span> : null}
          </div>
        );
      })}
    </div>
  );
};

