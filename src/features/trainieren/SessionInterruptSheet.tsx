import React from 'react';
import { useI18n } from '../../shared/lib/i18n';
import { Button } from '../../shared/ui/Button';
import { Icon } from '../../shared/ui/Icon';
import './trainieren.css';

export type SessionInterruptSheetProps = {
  onContinue: () => void;
  onExit: () => void;
};

export const SessionInterruptSheet: React.FC<SessionInterruptSheetProps> = ({ onContinue, onExit }) => {
  const { t } = useI18n();

  return (
    <div className="session-interrupt-sheet">
      <div className="session-interrupt-sheet__icon">
        <Icon name="info" filled size={26} />
      </div>
      <h3 className="session-interrupt-sheet__title">
        {t('trainieren.detail.confirm.message')}
      </h3>
      <p className="session-interrupt-sheet__subtitle">
        {t('trainieren.detail.confirm.subtitle')}
      </p>
      <div className="session-interrupt-sheet__actions">
        <Button variant="secondary" fullWidth onClick={onContinue}>
          {t('trainieren.detail.confirm.continue')}
        </Button>
        <Button variant="primary" fullWidth onClick={onExit}>
          {t('trainieren.detail.confirm.stop')}
        </Button>
      </div>
    </div>
  );
};







