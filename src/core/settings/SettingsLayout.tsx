import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '../../shared/ui/Card';
import { useI18n } from '../../shared/lib/i18n';

export const SettingsLayout: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="settings-layout">
      <div className="settings-layout__content">
        <Card>
          <h1>{t('settings.title')}</h1>
          <Outlet />
        </Card>
      </div>
    </div>
  );
};
