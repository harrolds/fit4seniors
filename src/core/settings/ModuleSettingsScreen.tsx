import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../shared/ui/Card';
import { useI18n } from '../../shared/lib/i18n';
import { getModuleById } from '../../shared/lib/modules';

const moduleSettingsComponents: Record<string, React.FC> = {};


export const ModuleSettingsScreen: React.FC = () => {
  const { moduleId } = useParams();
  const { t } = useI18n();

  if (!moduleId) {
    return null;
  }

  const moduleDefinition = getModuleById(moduleId);

  if (!moduleDefinition || !moduleDefinition.hasSettings) {
    return (
      <Card>
        <p className="settings-layout__muted">{t('settings.modules.unavailable')}</p>
      </Card>
    );
  }

  const ModuleSettingsComponent = moduleSettingsComponents[moduleId];

  if (!ModuleSettingsComponent) {
    return (
      <Card>
        <p className="settings-layout__muted">{t('settings.modules.unavailable')}</p>
      </Card>
    );
  }

  return <ModuleSettingsComponent />;
};

