export type PurchaseProvider = 'web_stripe' | 'play_billing' | 'apple_iap';

export interface BillingProvider {
  provider: PurchaseProvider;
  canPurchaseInApp: boolean;
  purchasePremium(): Promise<{ success: true } | { success: false; reason: string }>;
  restorePurchases(): Promise<{ isPremium: boolean }>;
  refreshEntitlement(): Promise<{ isPremium: boolean }>;
}

