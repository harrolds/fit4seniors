import React, { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { usePanels } from '../lib/panels/PanelContext';
import { Button } from './Button';
import { Icon } from './Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';
import '../panels/premium-gate-shared.css';

type PremiumGateSheetProps = {
  trainingId?: string;
  onClose?: () => void;
};

export const PremiumGateSheet: React.FC<PremiumGateSheetProps> = ({ trainingId, onClose }) => {
  const { t } = useI18n();
  const { openBottomSheet } = usePanels();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthHint, setShowAuthHint] = useState(false);

  const handleActivate = async () => {
    setErrorMessage(null);
    setShowAuthHint(false);
    setIsProcessing(true);
    try {
      const result = await billingProvider.purchasePremium();

      if (!result.success) {
        const reason = result.reason ?? 'checkout_unavailable';

        const requiresAuth =
          (typeof reason === 'string' &&
            (reason.toLowerCase().includes('anmelden') || reason.toLowerCase().includes('sitzung'))) ||
          reason === '401';

        if (requiresAuth) {
          setIsProcessing(false);
          setShowAuthHint(true);
          openBottomSheet('settings-account-access');
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
          <span className="premium-cta__content">
            {t('premium.panel.activateCta')}
            {isProcessing ? <span className="premium-cta__spinner" aria-hidden /> : <Icon name="arrow_forward" size={22} />}
          </span>
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isProcessing}>
          {t('common.back')}
        </Button>
      </div>
      {showAuthHint ? (
        <div className="premium-auth-hint" role="status">
          <span className="premium-auth-hint__icon">
            <Icon name="info" size={20} />
          </span>
          <p className="premium-auth-hint__text">{t('premium.purchase.loginHint')}</p>
        </div>
      ) : null}
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

