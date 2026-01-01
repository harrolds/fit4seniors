import React, { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useNotifications } from '../lib/notifications';
import { Button } from './Button';
import { Icon } from './Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';
import { getSession } from '../../core/user/userStore';
import { onPremiumActivated } from '../../core/premium/premiumGateFlow';

type PremiumGateSheetProps = {
  trainingId?: string;
  onClose?: () => void;
};

export const PremiumGateSheet: React.FC<PremiumGateSheetProps> = ({ trainingId, onClose }) => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivate = async () => {
    setIsProcessing(true);
    const result = await billingProvider.purchasePremium();
    setIsProcessing(false);

    if (!result.success) {
      const reason = result.reason ?? 'checkout_unavailable';
      if (reason === 'STRIPE_NOT_CONFIGURED') {
        showToast('premium.purchase.failed', { kind: 'error' });
      } else {
        showToast('premium.purchase.failedWithReason', { kind: 'error', params: { reason } });
      }
      return;
    }

    showToast('premium.purchase.activated', { kind: 'success' });
    if (getSession().entitlements.isPremium) {
      onPremiumActivated();
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
          {t('premium.gate.activateCta')}
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isProcessing}>
          {t('common.back')}
        </Button>
      </div>
    </div>
  );
};

