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

  const handleSyncToggle = () => {
    if (isGuest && !settings.syncEnabled) {
      showToast('account.sync.loginRequired', { kind: 'info' });
      goTo('/login');
      return;
    }
    saveSettings({ syncEnabled: !settings.syncEnabled });
  };

  const authStatusLabel = isGuest
    ? t('account.status.guest')
    : t('account.status.authenticated', { email: session.auth.email ?? t('account.status.emailUnknown') });

  return (
    <div className="page account-page">
      <header className="account-page__header">
        <h1 className="page-title">{t('account.title')}</h1>
        <p className="account-page__subtitle">{t('account.subtitle')}</p>
      </header>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.status.title')}</h2>
        <ul className="account-status">
          <li>
            <Icon name="person" size={20} />
            <span>{authStatusLabel}</span>
          </li>
          <li>
            <Icon name="workspace_premium" size={20} />
            <span>
              {session.entitlements.isPremium ? t('account.status.premiumOn') : t('account.status.premiumOff')}
            </span>
          </li>
          <li>
            <Icon name="admin_panel_settings" size={20} />
            <span>{session.admin.isAdmin ? t('account.status.adminOn') : t('account.status.adminOff')}</span>
          </li>
          <li>
            <Icon name="sync" size={20} />
            <span>{settings.syncEnabled ? t('account.status.syncOn') : t('account.status.syncOff')}</span>
          </li>
        </ul>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.sync.title')}</h2>
        <p className="account-section__description">{t('account.sync.description')}</p>
        <div className="account-actions">
          <Button type="button" variant={settings.syncEnabled ? 'secondary' : 'primary'} fullWidth onClick={handleSyncToggle}>
            {settings.syncEnabled ? t('account.sync.disable') : t('account.sync.enable')}
          </Button>
          {settings.syncEnabled ? (
            <p className="profile-helper profile-helper--success">{t('account.sync.enabledState')}</p>
          ) : null}
        </div>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.actions.title')}</h2>
        <div className="account-actions">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={isGuest ? handleLogin : handleLogout}
            disabled={isSigningOut}
          >
            {isGuest ? t('account.actions.login') : t('account.actions.logout')}
          </Button>
          <Button type="button" variant="primary" fullWidth onClick={handleRestore}>
            {t('account.actions.restore')}
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={handleRefresh}>
            {t('account.actions.refresh')}
          </Button>
          <Button type="button" variant="ghost" fullWidth onClick={handleAdminToggle}>
            {session.admin.isAdmin ? t('account.actions.disableAdmin') : t('account.actions.enableAdmin')}
          </Button>
        </div>
      </section>
    </div>
  );
};

