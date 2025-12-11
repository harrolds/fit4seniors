import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../shared/lib/i18n';
import { WidgetHost } from '../home/WidgetHost';
import { moduleRegistry } from '../../config/moduleRegistry';
import { SettingsLayout } from '../settings/SettingsLayout';
import { GlobalSettingsScreen } from '../settings/GlobalSettingsScreen';
import { ModuleSettingsScreen } from '../settings/ModuleSettingsScreen';
import { OfflineScreen } from '../offline/OfflineScreen';

const HomeScreen: React.FC = () => {
  const { openNotifications, openSettings } = useNavigation();
  const { t } = useI18n();

  return (
    <div className="home-screen">
      <section className="home-screen__intro">
        <h2>{t('home.title')}</h2>
        <p>{t('home.description')}</p>
        <div className="home-screen__actions">
          <Button type="button" onClick={openNotifications}>
            {t('home.goToNotifications')}
          </Button>
          <Button type="button" onClick={openSettings} variant="secondary">
            {t('home.goToSettings')}
          </Button>
        </div>
      </section>
      <WidgetHost />
    </div>
  );
};

const NotificationsScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { t } = useI18n();

  return (
    <div>
      <h2>{t('notifications.title')}</h2>
      <p>{t('notifications.description')}</p>
      <Button type="button" onClick={goBack}>
        {t('notifications.back')}
      </Button>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route path="/settings" element={<SettingsLayout />}>
        <Route index element={<GlobalSettingsScreen />} />
        <Route path=":moduleId" element={<ModuleSettingsScreen />} />
      </Route>
      {moduleRegistry.map((module) => {
        const ModuleComponent = module.component;
        return (
          <Route
            key={module.id}
            path={module.routeBase}
            element={<ModuleComponent />}
          />
        );
      })}
      <Route path="/offline" element={<OfflineScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
