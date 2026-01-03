import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '../../../config/runtimeEnv';
import { ensureLocalUserId, getSession, setSession } from '../../user/userStore';
import type { BillingProvider } from '../types';

const functionsBase = '/.netlify/functions';

const supabaseClient: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

const getAccessToken = async (): Promise<string | null> => {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.warn('[billing] Failed to read Supabase session', error);
    return null;
  }
  return data.session?.access_token ?? null;
};

const refreshEntitlement = async () => {
  if (import.meta.env?.VITE_PREMIUM_DEV === 'true') {
    setSession({ entitlements: { isPremium: true } });
    return { isPremium: true };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    setSession({ entitlements: { isPremium: false } });
    return { isPremium: false };
  }

  try {
    const response = await fetch(`${functionsBase}/stripe_entitlement`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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

    ensureLocalUserId(); // keep compatibility with any legacy local storage flows

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { success: false, reason: 'Bitte zuerst anmelden' };
    }

    try {
      const response = await fetch(`${functionsBase}/stripe_create_checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (response.status === 401) {
        return { success: false, reason: 'Sitzung abgelaufen – bitte erneut anmelden' };
      }

      if (!response.ok) {
        try {
          const err = (await response.json()) as { error?: string };
          if (err?.error) {
            return { success: false, reason: err.error };
          }
        } catch {
          // ignore parse errors and fall through to default reason
        }
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

