import { ensureLocalUserId, getSession, setSession } from '../../user/userStore';
import type { BillingProvider } from '../types';

const functionsBase = '/.netlify/functions';

const refreshEntitlement = async () => {
  const localUserId = ensureLocalUserId();

  if (import.meta.env?.VITE_PREMIUM_DEV === 'true') {
    setSession({ entitlements: { isPremium: true } });
    return { isPremium: true };
  }

  try {
    const response = await fetch(
      `${functionsBase}/stripe_entitlement?localUserId=${encodeURIComponent(localUserId)}`,
    );

    if (!response.ok) {
      return { isPremium: getSession().entitlements.isPremium };
    }

    const data = (await response.json()) as { isPremium?: boolean };
    const isPremium = Boolean(data?.isPremium);
    setSession({ entitlements: { isPremium } });
    return { isPremium };
  } catch {
    return { isPremium: getSession().entitlements.isPremium };
  }
};

export const webStripeProvider: BillingProvider = {
  provider: 'web_stripe',
  canPurchaseInApp: true,
  async purchasePremium() {
    if (import.meta.env?.VITE_PREMIUM_DEV === 'true') {
      setSession({ entitlements: { isPremium: true } });
      return { success: true };
    }

    const localUserId = ensureLocalUserId();

    try {
      const response = await fetch(`${functionsBase}/stripe_create_checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localUserId }),
      });

      if (!response.ok) {
        return { success: false, reason: 'checkout_unavailable' };
      }

      const data = (await response.json()) as { url?: string };
      if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }
      return { success: false, reason: 'missing_checkout_url' };
    } catch {
      return { success: false, reason: 'network_error' };
    }
  },
  async restorePurchases() {
    return refreshEntitlement();
  },
  async refreshEntitlement() {
    return refreshEntitlement();
  },
};

