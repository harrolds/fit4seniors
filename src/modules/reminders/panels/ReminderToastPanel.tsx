import React, { useEffect } from 'react';
import '../../../shared/panels/bottom-sheet.css';
import '../reminders.css';
import { useI18n } from '../../../shared/lib/i18n';
import { Icon } from '../../../shared/ui/Icon';
import { usePanels } from '../../../shared/lib/panels';

type ReminderToastPanelProps = {
  messageKey?: string;
  onClose?: () => void;
};

const AUTO_CLOSE_MS = 2200;

export const ReminderToastPanel: React.FC<ReminderToastPanelProps> = ({ messageKey = 'reminders.toast.saved', onClose }) => {
  const { t } = useI18n();
  const { closePanel } = usePanels();

  useEffect(() => {
    const id = window.setTimeout(() => {
      closePanel();
      onClose?.();
    }, AUTO_CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [closePanel, onClose]);

  return (
    <div className="bottom-sheet reminders-toast">
      <div className="bottom-sheet__body">
        <div className="reminders-toast__content">
          <span className="reminders-toast__icon">
            <Icon name="check_circle" size={24} />
          </span>
          <p className="reminders-toast__text">{t(messageKey)}</p>
        </div>
      </div>
      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-primary" onClick={closePanel}>
          {t('common.ok')}
        </button>
      </div>
    </div>
  );
};

