import React, { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useNotifications } from '../lib/notifications';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';
import { getSession } from '../../core/user/userStore';
import { onPremiumActivated } from '../../core/premium/premiumGateFlow';

type PremiumGatePanelProps = {
  trainingId?: string;
  title?: string;
  categoryId?: string;
  onClose?: () => void;
};

export const PremiumGatePanel: React.FC<PremiumGatePanelProps> = ({ title, onClose }) => {
  const { t, tList } = useI18n();
  const { showToast } = useNotifications();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const [isProcessing, setIsProcessing] = useState(false);

  const bullets = tList('premium.panel.bullets');

  const handleActivate = async () => {
    setIsProcessing(true);
    try {
      const result = await billingProvider.purchasePremium();

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
    } catch {
      showToast('premium.purchase.failedWithReason', {
        kind: 'error',
        params: { reason: 'network_error' },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="premium-panel">
      <div className="premium-panel__header">
        <div className="premium-panel__icon">
          <Icon name="workspace_premium" size={28} />
        </div>
        <div>
          <p className="premium-panel__eyebrow">{t('premium.gate.locked')}</p>
          <h2 className="premium-panel__title">{t('premium.panel.title')}</h2>
          {title ? <p className="premium-panel__training">{title}</p> : null}
        </div>
      </div>

      <p className="premium-panel__intro">{t('premium.panel.intro')}</p>
      <ul className="premium-panel__bullets">
        {bullets.map((bullet) => (
          <li key={bullet} className="premium-panel__bullet">
            <Icon name="check_circle" size={18} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <p className="premium-panel__disclaimer">{t('premium.panel.disclaimer')}</p>

      <div className="premium-panel__actions">
        <Button type="button" variant="primary" fullWidth onClick={handleActivate} disabled={isProcessing}>
          {t('premium.panel.activateCta')}
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isProcessing}>
          {t('premium.panel.back')}
        </Button>
      </div>
    </div>
  );
};


