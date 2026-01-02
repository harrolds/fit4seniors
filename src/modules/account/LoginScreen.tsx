import React, { useMemo, useState } from 'react';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { TextInput } from '../../shared/ui/TextInput';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { authAdapter } from '../../core/auth/authClient';

export const LoginScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const isValidEmail = useMemo(() => {
    const trimmed = email.trim();
    return trimmed.length > 0 && trimmed.includes('@');
  }, [email]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isValidEmail) {
      setError(t('account.login.invalidEmail'));
      return;
    }

    const trimmedEmail = email.trim();
    setStatus('sending');
    try {
      await authAdapter.requestMagicLink(trimmedEmail);
      setStatus('sent');
    } catch (authError) {
      console.error('[login] Failed to request magic link', authError);
      setStatus('idle');
      setError(t('account.login.sendError'));
    }
  };

  return (
    <div className="page">
      <SectionHeader as="h1" className="page-title" title={t('account.action.login')} subtitle={t('home.subtext')} />

      <form
        className="profile-form"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <div className="profile-section">
          <label className="profile-field-label" htmlFor="login-email">
            {t('account.login.emailLabel')}
          </label>
          <TextInput
            id="login-email"
            type="email"
            value={email}
            disabled={status === 'sending' || status === 'sent'}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder={t('account.login.emailPlaceholder')}
            aria-invalid={Boolean(error)}
          />
          {error ? <p className="profile-helper profile-helper--error">{error}</p> : null}
          {status === 'sent' ? (
            <p className="profile-helper profile-helper--success">{t('account.login.linkSent')}</p>
          ) : null}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={status === 'sending' || status === 'sent'}>
          {status === 'sent' ? t('account.login.waiting') : status === 'sending' ? t('common.loading') : t('account.login.sendLink')}
        </Button>

        <Button type="button" variant="ghost" fullWidth onClick={() => goTo('/profile')}>
          {t('auth.back')}
        </Button>
      </form>
    </div>
  );
};

