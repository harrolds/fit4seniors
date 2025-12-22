import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppRoutes } from './router';
import { AppFooter } from './AppFooter';
import { useNavigation } from '../shared/lib/navigation/useNavigation';
import { useI18n } from '../shared/lib/i18n';
import type { ScreenAction, ScreenActionClick, ScreenConfig } from './screenConfig';
import { getScreenConfigByPath } from '../config/navigation';
import { NotificationsHost } from '../shared/lib/notifications';
import { OfflineScreen } from './offline/OfflineScreen';
import { useTheme } from './theme/themeContext';
import { PanelHost } from './panels/PanelHost';
import { PanelProvider, usePanels } from '../shared/lib/panels';
import { HeaderActionsBar } from './header/HeaderActionsBar';
import { HeaderActionsMenu } from './header/HeaderActionsMenu';
import { getModuleById } from '../shared/lib/modules';
import { getHeaderActionHandler } from '../shared/lib/navigation/headerActionRegistry';
import { Button } from '../shared/ui/Button';
import { Icon } from '../shared/ui/Icon';
import { RemindersBootstrap } from '../modules/reminders';

const AppShellContent: React.FC = () => {
  const location = useLocation();
  const { goTo, goBack, openNotifications, openSettings } = useNavigation();
  const { t } = useI18n();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const theme = useTheme();
  const headerTokens = theme.components.header;
  const { state: panelState, closePanel, openBottomSheet } = usePanels();

  const mergeModuleActions = (config?: ScreenConfig) => {
    if (!config?.moduleId) {
      return config;
    }

    const moduleDef = getModuleById(config.moduleId);
    if (!moduleDef?.headerActions) {
      return config;
    }

    return {
      ...config,
      primaryActions: [
        ...(config.primaryActions ?? []),
        ...(moduleDef.headerActions.primaryActions ?? []),
      ],
      menuActions: [...(config.menuActions ?? []), ...(moduleDef.headerActions.menuActions ?? [])],
    };
  };

  const resolveHeaderActions = (config?: ScreenConfig) => {
    const primary: ScreenAction[] = [];
    const menu: ScreenAction[] = [];

    if (!config) {
      return { primary, menu };
    }

    if (config.actions) {
      primary.push(...config.actions);
    }

    if (config.primaryActions) {
      primary.push(...config.primaryActions);
    }

    if (config.menuActions) {
      menu.push(...config.menuActions);
    }

    return { primary, menu };
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useLayoutEffect(() => {
    // Make sure new screens always start at the top (some mobile browsers preserve scroll).
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [location.pathname, location.search]);

  const rawConfig = getScreenConfigByPath(location.pathname);
  const screenConfig = mergeModuleActions(rawConfig);
  const headerActions = resolveHeaderActions(screenConfig);
  const backAction = headerActions.primary.find((action) => action.id === 'goBack' || action.icon === 'back');
  const rightSidePrimary = headerActions.primary.filter((action) => action !== backAction);

  const handleDeclarativeClick = (action: ScreenAction, click: ScreenActionClick): boolean => {
    switch (click.type) {
      case 'navigate':
        goTo(click.target);
        return true;
      case 'panel':
        openBottomSheet(click.panelId, click.props);
        return true;
      case 'custom': {
        const handler = getHeaderActionHandler(click.handlerId);
        handler?.(action);
        return true;
      }
      default:
        return false;
    }
  };

  const handleActionClick = (action: ScreenAction) => {
    if (action.onClick) {
      const handled = handleDeclarativeClick(action, action.onClick);
      if (handled) {
        return;
      }
    }

    if (action.id === 'goBack') {
      goBack();
      return;
    }

    if (action.navigationTarget) {
      goTo(action.navigationTarget);
      return;
    }

    switch (action.id) {
      case 'openNotifications':
        openNotifications();
        return;
      case 'openSettings':
        openSettings();
        return;
      default:
        return;
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="app-shell">
      <header
        className="app-shell__header"
        style={{
          backgroundColor: 'var(--color-app-bg)',
          borderBottom: '1px solid var(--color-divider)',
          color: headerTokens.text,
          fontFamily: 'var(--font-family-base)',
        }}
      >
        <div className="app-shell__header-left">
          {backAction ? (
            <Button
              type="button"
              onClick={() => handleActionClick(backAction)}
              aria-label={t(backAction.labelKey)}
              className="app-shell__icon-button"
              variant="ghost"
              style={{ width: 36, height: 36, padding: 0 }}
            >
              <Icon name="arrow_back" size={24} />
            </Button>
          ) : null}
        </div>
        <div className="app-shell__header-center">
          <img
            src="/assets/brand/fit4seniors-header-logo.png"
            alt="Fit4Seniors"
            style={{ height: 36, width: 'auto', display: 'block' }}
          />
        </div>
        <div className="app-shell__header-right">
          <HeaderActionsBar actions={rightSidePrimary} onAction={handleActionClick} />
          <HeaderActionsMenu actions={headerActions.menu} onAction={handleActionClick} />
        </div>
      </header>
      <main className="app-shell__main">
        {isOffline ? <OfflineScreen onRetry={handleRetry} /> : <AppRoutes />}
      </main>
      <PanelHost state={panelState} onClose={closePanel} />
      <NotificationsHost />
      <RemindersBootstrap />
      <AppFooter />
    </div>
  );
};

export const AppShell: React.FC = () => {
  return (
    <PanelProvider>
      <AppShellContent />
    </PanelProvider>
  );
};
