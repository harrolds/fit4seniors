import React, { useMemo, useState } from 'react';
import { useI18n } from '../../shared/lib/i18n';
import { useNotifications } from '../../shared/lib/notifications';
import { usePanels } from '../../shared/lib/panels';
import { Button } from '../../shared/ui/Button';
import { Icon } from '../../shared/ui/Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';
import { setSession, useUserSession } from '../../core/user/userStore';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { authAdapter } from '../../core/auth/authClient';
import { saveSettings, useSettingsState } from '../settings/settingsStorage';

export const AccountScreen: React.FC = () => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const { openBottomSheet } = usePanels();
  const session = useUserSession();
  const { goTo } = useNavigation();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const isGuest = session.auth.status === 'anonymous';
  const settings = useSettingsState();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleRestore = async () => {
    const result = await billingProvider.restorePurchases();
    setSession({ entitlements: { isPremium: result.isPremium } });
    showToast(result.isPremium ? 'account.restore.success' : 'account.restore.inactive', {
      kind: result.isPremium ? 'success' : 'info',
    });
  };

  const handleRefresh = async () => {
    const result = await billingProvider.refreshEntitlement();
    setSession({ entitlements: { isPremium: result.isPremium } });
    showToast(result.isPremium ? 'account.refresh.success' : 'account.refresh.inactive', {
      kind: result.isPremium ? 'success' : 'info',
    });
  };

  const handleAdminToggle = () => {
    if (session.admin.isAdmin) {
      setSession({ admin: { isAdmin: false } });
      showToast('admin.unlock.disabled', { kind: 'info' });
      return;
    }
    openBottomSheet('admin-unlock');
  };

  const handleLogin = () => {
    goTo('/login');
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await authAdapter.signOut();
    } catch (error) {
      console.error('[account] Failed to sign out', error);
    } finally {
      setSession({
        auth: { status: 'anonymous', email: undefined, userId: undefined },
        entitlements: { isPremium: false },
        admin: { isAdmin: false },
      });
      setIsSigningOut(false);
    }
  };

  const statusItems = [
    {
      icon: 'person',
      label: t('account.status.guest'),
      value: isGuest ? t('common.yes') : t('common.no'),
    },
    {
      icon: 'check_circle',
      label: t('account.status.loggedIn'),
      value: isGuest ? t('common.no') : t('common.yes'),
    },
    {
      icon: 'workspace_premium',
      label: t('account.status.premium'),
      value: session.entitlements.isPremium ? t('common.yes') : t('common.no'),
    },
    {
      icon: 'sync',
      label: t('account.status.sync'),
      value: settings.syncEnabled ? t('common.yes') : t('common.no'),
    },
    {
      icon: 'admin_panel_settings',
      label: t('account.status.admin'),
      value: session.admin.isAdmin ? t('common.yes') : t('common.no'),
    },
  ];

  const handleSyncAction = () => {
    if (isGuest && !settings.syncEnabled) {
      goTo('/login');
      return;
    }
    saveSettings({ syncEnabled: !settings.syncEnabled });
  };

  const syncButtonLabel =
    isGuest && !settings.syncEnabled
      ? t('account.sync.loginCta')
      : settings.syncEnabled
        ? t('account.sync.disable')
        : t('account.sync.enable');

  return (
    <div className="page account-page">
      <header className="account-page__header">
        <h1 className="page-title">{t('account.title')}</h1>
        <p className="account-page__subtitle">{t('account.subtitle')}</p>
      </header>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.status.title')}</h2>
        <ul className="account-status">
          {statusItems.map((item) => (
            <li key={item.label}>
              <Icon name={item.icon as any} size={20} />
              <div className="account-status__row">
                <span className="account-status__label">{item.label}</span>
                <span className="account-status__value">{item.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.sync.title')}</h2>
        <p className="account-section__description">{t('account.sync.body')}</p>
        <div className="account-actions">
          <Button type="button" variant={settings.syncEnabled ? 'secondary' : 'primary'} fullWidth onClick={handleSyncAction}>
            {syncButtonLabel}
          </Button>
          {settings.syncEnabled ? (
            <p className="profile-helper profile-helper--success">{t('account.sync.enabledState')}</p>
          ) : null}
        </div>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.actions.title')}</h2>
        <div className="account-actions">
          {isGuest ? (
            <Button type="button" variant="primary" fullWidth onClick={handleLogin}>
              {t('account.action.login')}
            </Button>
          ) : (
            <Button type="button" variant="primary" fullWidth onClick={handleLogout} disabled={isSigningOut}>
              {t('account.action.logout')}
            </Button>
          )}
          <Button type="button" variant="primary" fullWidth onClick={handleRestore}>
            {t('account.action.restore')}
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={handleRefresh}>
            {t('account.action.refreshEntitlement')}
          </Button>
          <Button type="button" variant="ghost" fullWidth onClick={handleAdminToggle}>
            {session.admin.isAdmin ? t('account.actions.disableAdmin') : t('account.action.admin')}
          </Button>
        </div>
      </section>
    </div>
  );
};

