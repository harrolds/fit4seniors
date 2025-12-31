import { DISTRIBUTION_CHANNEL } from '../../config/distribution';
import { appleIapProvider } from './providers/appleIap';
import { playBillingProvider } from './providers/playBilling';
import { webStripeProvider } from './providers/webStripe';
import type { BillingProvider } from './types';

let cachedProvider: BillingProvider | null = null;

export const getBillingProvider = (): BillingProvider => {
  if (cachedProvider) return cachedProvider;

  switch (DISTRIBUTION_CHANNEL) {
    case 'play':
      cachedProvider = playBillingProvider;
      break;
    case 'ios':
      cachedProvider = appleIapProvider;
      break;
    case 'web':
    default:
      cachedProvider = webStripeProvider;
      break;
  }

  return cachedProvider;
};

