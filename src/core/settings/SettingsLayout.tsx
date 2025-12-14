import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '../../shared/ui/Card';
import { List, ListItem } from '../../shared/ui/List';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../shared/lib/i18n';
import { moduleRegistry } from '../../config/moduleRegistry';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';

export const SettingsLayout: React.FC = () => {
  const { t } = useI18n();
  const { openModuleSettings, goTo } = useNavigation();

  const settingsEnabledModules = useMemo(
    () => moduleRegistry.filter((module) => module.hasSettings),
    []
  );

  return (
    <div className="settings-layout">
      <div className="settings-layout__sidebar">
        <Card>
          <header className="settings-layout__header">
            <div>
              <h2 className="settings-layout__title">{t('settings.title')}</h2>
              <p className="settings-layout__description">{t('settings.global.description')}</p>
            </div>
          </header>

          <div className="settings-layout__module-list">
            <h3 className="settings-layout__section-title">{t('settings.modules.title')}</h3>
            <List>
              {/* TEMPORARY TEST ENTRY — Phase 9 (Reminders) */}
              {/* Remove when Phase 11 Settings Hub is implemented */}
              <ListItem>
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => goTo('/reminders')}
                >
                  🔧 Reminders (Test – Phase 9)
                </Button>
              </ListItem>

              {settingsEnabledModules.map((module) => (
                <ListItem key={module.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => openModuleSettings(module.id)}
                  >
                    {t(module.labelKey)}
                  </Button>
                </ListItem>
              ))}
            </List>
            {settingsEnabledModules.length === 0 && (
              <p className="settings-layout__muted">{t('settings.modules.empty')}</p>
            )}
          </div>
        </Card>
      </div>

      <div className="settings-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

