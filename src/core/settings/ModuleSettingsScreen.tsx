import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../shared/ui/Card';
import { useI18n } from '../../shared/lib/i18n';
import { getModuleById } from '../../shared/lib/modules';
import { SectionHeader } from '../../shared/ui/SectionHeader';

const moduleSettingsComponents: Record<string, React.FC> = {};


export const ModuleSettingsScreen: React.FC = () => {
  const { moduleId } = useParams();
  const { t } = useI18n();

  if (!moduleId) {
    return null;
  }

  const moduleDefinition = getModuleById(moduleId);
  const pageTitle = moduleDefinition ? t(moduleDefinition.labelKey) : t('settings.title');
  const pageSubtitle = moduleDefinition?.hasSettings ? undefined : t('settings.modules.unavailable');

  if (!moduleDefinition || !moduleDefinition.hasSettings) {
    return (
      <>
        <SectionHeader as="h1" className="page-title" title={pageTitle} subtitle={pageSubtitle} />
        <Card>
          <p className="settings-layout__muted">{t('settings.modules.unavailable')}</p>
        </Card>
      </>
    );
  }

  const ModuleSettingsComponent = moduleSettingsComponents[moduleId];

  if (!ModuleSettingsComponent) {
    return (
      <>
        <SectionHeader as="h1" className="page-title" title={pageTitle} subtitle={pageSubtitle} />
        <Card>
          <p className="settings-layout__muted">{t('settings.modules.unavailable')}</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHeader as="h1" className="page-title" title={pageTitle} />
      <ModuleSettingsComponent />
    </>
  );
};

