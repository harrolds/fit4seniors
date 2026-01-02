import React, { useMemo, useState } from 'react';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { TextInput } from '../../shared/ui/TextInput';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { setSession } from '../../core/user/userStore';

const generateUserId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const LoginScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = useMemo(() => {
    const trimmed = email.trim();
    return trimmed.length > 0 && trimmed.includes('@');
  }, [email]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidEmail) {
      setError(t('validation.required'));
      return;
    }
    const trimmedEmail = email.trim();
    setSession({
      auth: {
        status: 'authenticated',
        email: trimmedEmail,
        userId: generateUserId(),
      },
    });
    goTo('/profile');
  };

  return (
    <div className="page">
      <SectionHeader as="h1" className="page-title" title={t('account.actions.login')} subtitle={t('home.subtext')} />

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
        </div>

        <Button type="submit" variant="primary" fullWidth>
          {t('profile.actions.loginCta')}
        </Button>
      </form>
    </div>
  );
};

