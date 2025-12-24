import React from 'react';
import '../../../shared/panels/bottom-sheet.css';
import '../reminders.css';
import { useI18n } from '../../../shared/lib/i18n';
import { RemindersView } from '../components/RemindersView';

type SettingsRemindersSheetProps = {
  onClose?: () => void;
};

export const SettingsRemindersSheet: React.FC<SettingsRemindersSheetProps> = () => {
  const { t } = useI18n();

  return (
    <div className="bottom-sheet reminders-sheet">
      <div className="bottom-sheet__header">
        <h2 className="bottom-sheet__title">{t('pageTitles.reminders')}</h2>
      </div>
      <div className="bottom-sheet__body">
        <RemindersView variant="sheet" />
      </div>
    </div>
  );
};

