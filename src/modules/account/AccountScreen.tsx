import React, { useMemo } from 'react';
import { useI18n } from '../../shared/lib/i18n';
import { useNotifications } from '../../shared/lib/notifications';
import { usePanels } from '../../shared/lib/panels';
import { Button } from '../../shared/ui/Button';
import { Icon } from '../../shared/ui/Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';
import { setSession, useUserSession } from '../../core/user/userStore';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';

export const AccountScreen: React.FC = () => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const { openBottomSheet } = usePanels();
  const session = useUserSession();
  const { goTo } = useNavigation();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const isGuest = session.auth.status === 'anonymous';

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

  const handleLogout = () => {
    setSession({
      auth: { status: 'anonymous' },
      entitlements: { isPremium: false },
      admin: { isAdmin: false },
    });
  };

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
            <span>{t('account.status.auth', { state: session.auth.status })}</span>
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
        </ul>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{t('account.actions.title')}</h2>
        <div className="account-actions">
          <Button type="button" variant="primary" fullWidth onClick={isGuest ? handleLogin : handleLogout}>
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

