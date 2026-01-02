import React, { useEffect } from 'react';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { useI18n } from '../../shared/lib/i18n';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useUserSession } from '../../core/user/userStore';

export const LoginCallbackScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const session = useUserSession();

  useEffect(() => {
    if (session.auth.status === 'authenticated') {
      goTo('/profile');
    }
  }, [goTo, session.auth.status]);

  return (
    <div className="page">
      <SectionHeader
        as="h1"
        className="page-title"
        title={t('account.login.callbackTitle')}
        subtitle={t('account.login.callbackSubtitle')}
      />
      <p aria-busy="true">{t('account.login.callbackMessage')}</p>
    </div>
  );
};

