// Contract: Defines app routes; "/" renders HomeScreen (WidgetHost), module routes come from moduleRegistry, plus settings/notifications/offline/catch-all.
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../shared/lib/i18n';
import { WidgetHost } from '../home/WidgetHost';
import { moduleRegistry } from '../../config/moduleRegistry';
import { OfflineScreen } from '../offline/OfflineScreen';
import { useDisplayName } from '../../modules/profile';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { LoginPlaceholder } from '../../modules/account/LoginPlaceholder';

const HomeScreen: React.FC = () => {
  const { t } = useI18n();
  const displayName = useDisplayName('');
  const nameSuffix = displayName ? `, ${displayName}` : '';

  const getGreetingKey = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'home.greeting.morning';
    if (hour >= 12 && hour < 18) return 'home.greeting.afternoon';
    return 'home.greeting.evening';
  };

  const greetingKey = getGreetingKey();

  return (
    <div className="page home-page">
      <section className="home-page__intro">
        <SectionHeader
          as="h1"
          className="page-title"
          title={t(greetingKey, { name: nameSuffix })}
          subtitle={t('home.subtext')}
        />
      </section>
      <WidgetHost />
    </div>
  );
};

const NotificationsScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { t } = useI18n();

  return (
    <div className="page">
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
      <Route path="/login" element={<LoginPlaceholder />} />
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
