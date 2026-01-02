import React, { useMemo, useState } from 'react';
import '../../../shared/panels/bottom-sheet.css';
import './account-access-sheet.css';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { usePanels } from '../../../shared/lib/panels';
import { useNotifications } from '../../../shared/lib/notifications';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { Card } from '../../../shared/ui/Card';
import { getBillingProvider } from '../../../core/billing/getBillingProvider';
import { authAdapter } from '../../../core/auth/authClient';
import { setSession, useUserSession } from '../../../core/user/userStore';
import { saveSettings, useSettingsState } from '../settingsStorage';

type AccountAccessSheetProps = {
  onClose?: () => void;
};

type StatusItem = {
  key: string;
  icon: string;
  label: string;
  value: string;
};

export const AccountAccessSheet: React.FC<AccountAccessSheetProps> = ({ onClose }) => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const { openBottomSheet } = usePanels();
  const { showToast } = useNotifications();
  const session = useUserSession();
  const settings = useSettingsState();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isGuest = session.auth.status === 'anonymous';

  const closeSheet = () => {
    if (onClose) {
      onClose();
    }
  };

  const navigateWithClose = (path: string) => {
    closeSheet();
    requestAnimationFrame(() => goTo(path));
  };

  const statusItems: StatusItem[] = [
    {
      key: 'guest',
      icon: 'person',
      label: t('account.status.guest'),
      value: isGuest ? t('common.yes') : t('common.no'),
    },
    {
      key: 'logged-in',
      icon: 'login',
      label: t('account.status.loggedIn'),
      value: isGuest ? t('common.no') : t('common.yes'),
    },
    {
      key: 'premium',
      icon: 'workspace_premium',
      label: t('account.status.premium'),
      value: session.entitlements.isPremium ? t('common.yes') : t('common.no'),
    },
    {
      key: 'sync',
      icon: 'sync',
      label: t('account.status.sync'),
      value: settings.syncEnabled ? t('common.yes') : t('common.no'),
    },
  ];

  if (session.admin.isAdmin) {
    statusItems.push({
      key: 'admin',
      icon: 'admin_panel_settings',
      label: t('account.status.admin'),
      value: t('common.yes'),
    });
  }

  const handleSyncAction = () => {
    if (isGuest) {
      navigateWithClose('/login');
      return;
    }
    saveSettings({ syncEnabled: !settings.syncEnabled });
  };

  const handleRestore = async () => {
    try {
      const result = await billingProvider.restorePurchases();
      setSession({ entitlements: { isPremium: result.isPremium } });
      showToast(result.isPremium ? 'account.restore.success' : 'account.restore.inactive', {
        kind: result.isPremium ? 'success' : 'info',
      });
    } catch (error) {
      console.error('[account-sheet] Failed to restore purchases', error);
    }
  };

  const handleRefresh = async () => {
    try {
      const result = await billingProvider.refreshEntitlement();
      setSession({ entitlements: { isPremium: result.isPremium } });
      showToast(result.isPremium ? 'account.refresh.success' : 'account.refresh.inactive', {
        kind: result.isPremium ? 'success' : 'info',
      });
    } catch (error) {
      console.error('[account-sheet] Failed to refresh entitlement', error);
    }
  };

  const handleAdminToggle = () => {
    if (session.admin.isAdmin) {
      setSession({ admin: { isAdmin: false } });
      showToast('admin.unlock.disabled', { kind: 'info' });
      return;
    }
    openBottomSheet('admin-unlock');
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await authAdapter.signOut();
    } catch (error) {
      console.error('[account-sheet] Failed to sign out', error);
    } finally {
      setSession({
        auth: { status: 'anonymous', email: undefined, userId: undefined },
        entitlements: { isPremium: false },
        admin: { isAdmin: false },
      });
      setIsSigningOut(false);
      closeSheet();
    }
  };

  const syncButtonLabel = isGuest
    ? t('account.sync.loginCta')
    : settings.syncEnabled
      ? t('account.sync.disable')
      : t('account.sync.enable');

  return (
    <div className="bottom-sheet account-sheet">
      <div className="bottom-sheet__header account-sheet__header">
        <div className="account-sheet__title-block">
          <h2 className="bottom-sheet__title">{t('account.title')}</h2>
          <p className="account-sheet__subtitle">{t('account.subtitle')}</p>
        </div>
        <button type="button" className="bottom-sheet__reset" onClick={closeSheet}>
          {t('common.close')}
        </button>
      </div>

      <div className="bottom-sheet__body account-sheet__body">
        <Card className="account-sheet__card">
          <div className="account-sheet__card-head">
            <div className="account-sheet__icon account-sheet__icon--status">
              <Icon name="verified_user" size={24} />
            </div>
            <div>
              <h3 className="account-sheet__card-title">{t('account.status.title')}</h3>
              <p className="account-sheet__card-subtitle">{t('account.subtitle')}</p>
            </div>
          </div>

          <ul className="account-sheet__status-list">
            {statusItems.map((item) => (
              <li key={item.key} className="account-sheet__status-item">
                <div className="account-sheet__status-left">
                  <span className="account-sheet__status-icon">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span className="account-sheet__status-label">{item.label}</span>
                </div>
                <span className="account-sheet__status-value">{item.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="account-sheet__card">
          <div className="account-sheet__card-head">
            <div className="account-sheet__icon account-sheet__icon--sync">
              <Icon name="sync" size={24} />
            </div>
            <div>
              <h3 className="account-sheet__card-title">{t('account.sync.title')}</h3>
              <p className="account-sheet__card-subtitle">{t('account.sync.body')}</p>
            </div>
          </div>

          <div className="account-sheet__actions">
            <Button
              fullWidth
              variant={settings.syncEnabled ? 'secondary' : 'primary'}
              onClick={handleSyncAction}
            >
              <Icon name="cloud_sync" size={20} />
              {syncButtonLabel}
            </Button>
            {settings.syncEnabled ? (
              <p className="account-sheet__hint">{t('account.sync.enabledState')}</p>
            ) : null}
          </div>
        </Card>

        <Card className="account-sheet__card">
          <div className="account-sheet__card-head">
            <div className="account-sheet__icon account-sheet__icon--actions">
              <Icon name="lock_open" size={24} />
            </div>
            <div>
              <h3 className="account-sheet__card-title">{t('account.actions.title')}</h3>
            </div>
          </div>

          <div className="account-sheet__actions">
            {isGuest ? (
              <Button fullWidth onClick={() => navigateWithClose('/login')}>
                <Icon name="login" size={20} />
                {t('account.action.login')}
              </Button>
            ) : (
              <Button fullWidth onClick={handleLogout} disabled={isSigningOut}>
                <Icon name="logout" size={20} />
                {isSigningOut ? t('common.loading') : t('account.action.logout')}
              </Button>
            )}

            <Button fullWidth variant="secondary" onClick={handleRestore}>
              <Icon name="restore" size={20} />
              {t('account.action.restore')}
            </Button>

            <Button fullWidth variant="ghost" onClick={handleRefresh}>
              <Icon name="refresh" size={20} />
              {t('account.action.refreshEntitlement')}
            </Button>
          </div>

          {import.meta.env.DEV ? (
            <div className="account-sheet__dev">
              <span className="account-sheet__dev-chip">DEV</span>
              <Button fullWidth variant="ghost" onClick={handleAdminToggle}>
                <Icon name="admin_panel_settings" size={20} />
                {session.admin.isAdmin ? t('account.actions.disableAdmin') : t('account.action.admin')}
              </Button>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-secondary" onClick={closeSheet}>
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};


