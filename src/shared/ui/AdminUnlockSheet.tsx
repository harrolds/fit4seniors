import React, { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useNotifications } from '../lib/notifications';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { useUserSession, setSession } from '../../core/user/userStore';

type AdminUnlockSheetProps = {
  onClose?: () => void;
};

const resolveAdminCode = (): string => {
  const raw = import.meta.env?.VITE_ADMIN_CODE;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'fit4-admin';
};

export const AdminUnlockSheet: React.FC<AdminUnlockSheetProps> = ({ onClose }) => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const session = useUserSession();
  const adminCode = useMemo(resolveAdminCode, []);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEnable = () => {
    if (input.trim() !== adminCode) {
      setError(t('admin.unlock.invalid'));
      return;
    }
    setSession({ admin: { isAdmin: true } });
    setError(null);
    showToast('admin.unlock.enabled', { kind: 'success' });
    onClose?.();
  };

  const handleDisable = () => {
    setSession({ admin: { isAdmin: false } });
    setError(null);
    showToast('admin.unlock.disabled', { kind: 'info' });
    onClose?.();
  };

  return (
    <div className="admin-unlock">
      <h2 className="admin-unlock__title">{t('admin.unlock.title')}</h2>
      <p className="admin-unlock__copy">{t('admin.unlock.body')}</p>
      <label className="admin-unlock__label">
        {t('admin.unlock.codeLabel')}
        <TextInput
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t('admin.unlock.placeholder')}
          autoComplete="off"
        />
      </label>
      {error ? <p className="admin-unlock__error">{error}</p> : null}
      <div className="admin-unlock__actions">
        <Button type="button" variant="primary" fullWidth onClick={handleEnable}>
          {t('admin.unlock.enableCta')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleDisable}
          disabled={!session.admin.isAdmin}
        >
          {t('admin.unlock.disableCta')}
        </Button>
      </div>
    </div>
  );
};

