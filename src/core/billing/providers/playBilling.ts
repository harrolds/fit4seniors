import type { BillingProvider } from '../types';

export const playBillingProvider: BillingProvider = {
  provider: 'play_billing',
  canPurchaseInApp: true,
  async purchasePremium() {
    return { success: false, reason: 'Play Billing not implemented in this build yet.' };
  },
  async restorePurchases() {
    // TODO: Wire up TWA + Digital Goods API for Play Billing.
    return { isPremium: false };
  },
  async refreshEntitlement() {
    // TODO: Integrate Play Billing entitlement refresh when available.
    return { isPremium: false };
  },
};

