import React, { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { usePanels } from '../lib/panels/PanelContext';
import { Button } from './Button';
import { Icon } from './Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';

type PremiumGateSheetProps = {
  trainingId?: string;
  onClose?: () => void;
};

export const PremiumGateSheet: React.FC<PremiumGateSheetProps> = ({ trainingId, onClose }) => {
  const { t } = useI18n();
  const { openBottomSheet, closePanel } = usePanels();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleActivate = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const result = await billingProvider.purchasePremium();

      if (!result.success) {
        const reason = result.reason ?? 'checkout_unavailable';

        const requiresAuth =
          typeof reason === 'string' &&
          (reason.includes('Bitte zuerst anmelden') || reason.includes('Sitzung abgelaufen'));

        if (requiresAuth) {
          setIsProcessing(false);
          openBottomSheet('settings-account-access');
          if (onClose) {
            onClose();
          } else {
            closePanel();
          }
          return;
        }

        if (reason === 'STRIPE_NOT_CONFIGURED') {
          setErrorMessage(t('premium.purchase.failed'));
        } else {
          setErrorMessage(t('premium.purchase.failedWithReason', { reason }));
        }

        setIsProcessing(false);
        return;
      }

      // Success path hands off to billing provider redirect; keep processing state.
      return;
    } catch {
      setErrorMessage(t('premium.purchase.failedWithReason', { reason: 'network_error' }));
      setIsProcessing(false);
    }
  };

  return (
    <div className="premium-gate">
      <div className="premium-gate__header">
        <div className="premium-gate__icon">
          <Icon name="lock" size={28} />
        </div>
        <div>
          <p className="premium-gate__eyebrow">{t('premium.gate.locked')}</p>
          <h2 className="premium-gate__title">{t('premium.gate.title')}</h2>
        </div>
      </div>
      <p className="premium-gate__body">
        {t('premium.gate.body', { training: trainingId ?? t('premium.gate.trainingFallback') })}
      </p>
      <div className="premium-gate__actions">
        <Button type="button" variant="primary" fullWidth onClick={handleActivate} disabled={isProcessing}>
          {isProcessing ? 'Weiterleitung zu Stripe…' : t('premium.gate.activateCta')}
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isProcessing}>
          {t('common.back')}
        </Button>
      </div>
      {errorMessage ? (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-lg)',
            background: 'color-mix(in srgb, var(--color-error) 10%, white)',
            color: 'var(--color-error)',
          }}
        >
          <Icon name="error" size={20} aria-hidden />
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-normal)' }}>
            {errorMessage}
          </p>
        </div>
      ) : null}
    </div>
  );
};

