import React from 'react';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useI18n } from '../../../shared/lib/i18n';
import { RemindersView } from '../components/RemindersView';

export const RemindersSettingsScreen: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="reminders-page">
      <SectionHeader as="h1" className="page-title" title={t('pageTitles.reminders')} subtitle={t('reminders.intro')} />
      <RemindersView variant="page" />
    </div>
  );
};

