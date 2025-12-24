import React from 'react';
import '../../shared/panels/bottom-sheet.css';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import './trainieren.css';

export type SessionInterruptSheetProps = {
  onContinue: () => void;
  onExit: () => void;
};

export const SessionInterruptSheet: React.FC<SessionInterruptSheetProps> = ({ onContinue, onExit }) => {
  const { t } = useI18n();

  return (
    <div className="bottom-sheet session-interrupt-sheet">
      <div className="bottom-sheet__header session-interrupt-sheet__header">
        <div className="session-interrupt-sheet__icon">
          <Icon name="info" filled size={26} />
        </div>
        <h2 className="bottom-sheet__title session-interrupt-sheet__title">{t('trainieren.detail.confirm.message')}</h2>
      </div>
      <div className="bottom-sheet__body session-interrupt-sheet__body">
        <p className="session-interrupt-sheet__subtitle">{t('trainieren.detail.confirm.subtitle')}</p>
      </div>
      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-secondary" onClick={onContinue}>
          {t('trainieren.detail.confirm.continue')}
        </button>
        <button type="button" className="bottom-sheet__btn-primary" onClick={onExit}>
          {t('trainieren.detail.confirm.stop')}
        </button>
      </div>
    </div>
  );
};







