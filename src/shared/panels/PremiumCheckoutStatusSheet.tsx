import React, { useCallback, useEffect, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import { usePanels } from '../lib/panels';
import { Icon } from '../ui/Icon';
import './bottom-sheet.css';
import './premium-gate-shared.css';

type PremiumCheckoutStatusProps = {
  tone?: 'success' | 'pending' | 'info';
  message: string;
  loading?: boolean;
  onAcknowledge?: () => void;
  onClose?: () => void;
};

export const PremiumCheckoutStatusSheet: React.FC<PremiumCheckoutStatusProps> = ({
  tone = 'info',
  message,
  loading = false,
  onAcknowledge,
}) => {
  const { closePanel } = usePanels();
  const { t } = useI18n();
  const hasAcknowledgedRef = useRef(false);

  const iconName = tone === 'success' ? 'check_circle' : tone === 'pending' ? 'schedule' : 'info';

  const acknowledge = useCallback(() => {
    if (hasAcknowledgedRef.current) return;
    hasAcknowledgedRef.current = true;
    onAcknowledge?.();
  }, [onAcknowledge]);

  useEffect(
    () => () => {
      acknowledge();
    },
    [acknowledge],
  );

  const handleClose = () => {
    acknowledge();
    closePanel();
  };

  return (
    <div className="bottom-sheet premium-status">
      <div className="bottom-sheet__body premium-status__body">
        <div className="premium-status__icon" data-tone={tone} aria-hidden="true">
          {loading ? <span className="premium-cta__spinner" aria-hidden /> : <Icon name={iconName} size={26} />}
        </div>
        <p className="premium-status__message">{message}</p>
      </div>
      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-primary" onClick={handleClose}>
          {t('common.ok')}
        </button>
      </div>
    </div>
  );
};


