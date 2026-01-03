import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { usePanels } from '../../shared/lib/panels';
import { getBillingProvider } from '../billing/getBillingProvider';
import type { BillingProvider } from '../billing/types';
import { onPremiumActivated } from './premiumGateFlow';

const WAIT_BEFORE_RETRY_MS = 2000;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const isAuthoredReferrer = (): boolean => {
  if (!document.referrer) return false;
  try {
    const ref = new URL(document.referrer);
    return ref.origin === window.location.origin;
  } catch {
    return false;
  }
};

export const usePremiumCheckoutCallback = (provider?: BillingProvider) => {
  const billingProvider = useMemo(() => provider ?? getBillingProvider(), [provider]);
  const { openBottomSheet, closePanel } = usePanels();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    const hash = location.hash || '';
    const callbackPath =
      hash.startsWith('#/premium/') ? hash.replace('#', '') : location.pathname.startsWith('/premium/') ? location.pathname : null;

    if (!callbackPath) {
      return;
    }

    if (handledRef.current === callbackPath) {
      return;
    }
    handledRef.current = callbackPath;

    const navigateBackOrTrainings = () => {
      if (isAuthoredReferrer()) {
        navigate(-1);
        return;
      }
      navigate('/trainieren', { replace: true });
    };

    const showStatusSheet = (tone: 'success' | 'pending' | 'info', message: string, loading = false) => {
      openBottomSheet('premium-checkout-status', {
        tone,
        message,
        loading,
        onAcknowledge: navigateBackOrTrainings,
      });
    };

    const handleSuccessFlow = async () => {
      closePanel();
      const first = await billingProvider.refreshEntitlement();
      if (first.isPremium) {
        onPremiumActivated();
        showStatusSheet('success', t('premium.checkout.success'));
        return;
      }

      showStatusSheet('pending', t('premium.checkout.pending'), true);
      await wait(WAIT_BEFORE_RETRY_MS);

      const second = await billingProvider.refreshEntitlement();
      if (second.isPremium) {
        onPremiumActivated();
        showStatusSheet('success', t('premium.checkout.success'));
        return;
      }

      showStatusSheet('info', t('premium.checkout.pending'));
    };

    if (callbackPath.startsWith('/premium/success')) {
      handleSuccessFlow();
      return;
    }

    if (callbackPath.startsWith('/premium/cancel')) {
      closePanel();
      showStatusSheet('info', t('premium.checkout.cancelled'));
    }
  }, [billingProvider, closePanel, location.hash, location.pathname, navigate, openBottomSheet, t]);
};


