import React, { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useNotifications } from '../lib/notifications';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { getBillingProvider } from '../../core/billing/getBillingProvider';
import { getSession } from '../../core/user/userStore';
import { onPremiumActivated } from '../../core/premium/premiumGateFlow';
import './premium-gate-panel.css';

type PremiumGatePanelProps = {
  trainingId?: string;
  title?: string;
  categoryId?: string;
  onClose?: () => void;
};

export const PremiumGatePanel: React.FC<PremiumGatePanelProps> = ({ title, onClose }) => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const billingProvider = useMemo(() => getBillingProvider(), []);
  const [isProcessing, setIsProcessing] = useState(false);

  const lockedTrainingTitle = title?.trim() || t('premium.panel.trainingFallback');
  const benefits = [
    {
      icon: 'check_circle',
      title: t('premium.panel.benefits.access.title'),
      subtitle: t('premium.panel.benefits.access.subtitle'),
    },
    {
      icon: 'fitness_center',
      title: t('premium.panel.benefits.variety.title'),
      subtitle: t('premium.panel.benefits.variety.subtitle'),
    },
    {
      icon: 'lock_open',
      title: t('premium.panel.benefits.noLimits.title'),
      subtitle: t('premium.panel.benefits.noLimits.subtitle'),
    },
    {
      icon: 'calendar_month',
      title: t('premium.panel.benefits.flexibility.title'),
      subtitle: t('premium.panel.benefits.flexibility.subtitle'),
    },
  ];

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
      <header className="premium-panel__header">
        <button
          type="button"
          className="premium-panel__back"
          onClick={onClose}
          aria-label={t('premium.panel.back')}
          disabled={isProcessing}
        >
          <Icon name="arrow_back" size={22} />
        </button>
        <h1 className="premium-panel__heading">{t('premium.panel.title')}</h1>
      </header>

      <section className="premium-panel__locked">
        <p className="premium-panel__locked-label">{t('premium.gate.locked')}</p>
        <p className="premium-panel__locked-title">{lockedTrainingTitle}</p>
      </section>

      <section className="premium-panel__card" aria-labelledby="premium-benefits-heading">
        <h2 id="premium-benefits-heading" className="premium-panel__card-title">
          {t('premium.panel.intro')}
        </h2>
        <ul className="premium-panel__benefits">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="premium-panel__benefit">
              <span className="premium-panel__benefit-icon" aria-hidden>
                <Icon name={benefit.icon} size={22} filled />
              </span>
              <div className="premium-panel__benefit-copy">
                <p className="premium-panel__benefit-title">{benefit.title}</p>
                <p className="premium-panel__benefit-subtitle">{benefit.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="premium-panel__disclaimer">{t('premium.panel.disclaimer')}</p>

      <div className="premium-panel__actions">
        <Button
          type="button"
          variant="primary"
          fullWidth
          className="premium-panel__cta"
          onClick={handleActivate}
          disabled={isProcessing}
        >
          <span>{t('premium.panel.activateCta')}</span>
          <Icon name="arrow_forward" size={22} />
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="premium-panel__secondary"
          onClick={onClose}
          disabled={isProcessing}
        >
          {t('premium.panel.back')}
        </Button>
      </div>
    </div>
  );
};


