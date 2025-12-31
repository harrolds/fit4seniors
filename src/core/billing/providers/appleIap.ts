import type { BillingProvider } from '../types';

export const appleIapProvider: BillingProvider = {
  provider: 'apple_iap',
  canPurchaseInApp: true,
  async purchasePremium() {
    return { success: false, reason: 'Apple IAP not implemented in this build yet.' };
  },
  async restorePurchases() {
    // TODO: Integrate StoreKit restore flow via native wrapper.
    return { isPremium: false };
  },
  async refreshEntitlement() {
    // TODO: Refresh entitlements from Apple IAP once wrapper is available.
    return { isPremium: false };
  },
};

