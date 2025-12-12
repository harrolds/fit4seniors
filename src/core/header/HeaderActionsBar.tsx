import React from 'react';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../shared/lib/i18n';
import type { ScreenAction } from '../screenConfig';
import { Icon } from '../../shared/ui/Icon';

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

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="app-shell__actions-bar">
      {actions.map((action) => (
        <Button
          key={action.id}
          type="button"
          onClick={() => onAction(action)}
          aria-label={t(action.labelKey)}
          className="app-shell__icon-button"
          variant="ghost"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          <Icon name={resolveIconName(action)} size={24} />
        </Button>
      ))}
    </div>
  );
};

