const { getSupabaseAdminClient } = require('./_lib/supabaseAdmin');
const { getUserOrThrow } = require('./_lib/auth');
const { getStripeClient } = require('./_lib/stripe');

const jsonResponse = (statusCode, body, allowMethods = 'POST') => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': allowMethods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  body: JSON.stringify(body),
});

const requireEnv = () => {
  const required = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID',
    'APP_BASE_URL',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    const error = new Error(`Missing environment variables: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }
};

const ensureEntitlement = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    const err = new Error('Failed to load entitlements');
    err.statusCode = 500;
    throw err;
  }

  if (data) return data;

  const { error: upsertError } = await supabase
    .from('entitlements')
    .upsert({ user_id: userId, is_premium: false }, { onConflict: 'user_id' });

  if (upsertError) {
    const err = new Error('Failed to initialize entitlements');
    err.statusCode = 500;
    throw err;
  }

  return { user_id: userId, is_premium: false };
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true }, 'POST, OPTIONS');
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, 'POST');
  }

  try {
    requireEnv();
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message });
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message });
  }

  let user;
  try {
    user = await getUserOrThrow(supabase, event.headers);
  } catch (err) {
    return jsonResponse(err.statusCode || 401, { error: 'UNAUTHORIZED' });
  }

  let entitlement;
  try {
    entitlement = await ensureEntitlement(supabase, user.id);
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message || 'ENTITLEMENT_ERROR' });
  }

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message });
  }

  let customerId = entitlement.stripe_customer_id;

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabaseUserId: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('entitlements')
        .upsert(
          { user_id: user.id, stripe_customer_id: customerId, is_premium: entitlement.is_premium },
          { onConflict: 'user_id' },
        );
    } catch (err) {
      console.error('stripe_customer_create_failed', err.message);
      return jsonResponse(500, { error: 'STRIPE_CUSTOMER_ERROR' });
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      client_reference_id: user.id,
      customer: customerId,
      success_url: `${process.env.APP_BASE_URL}/#/premium/success`,
      cancel_url: `${process.env.APP_BASE_URL}/#/premium/cancel`,
      allow_promotion_codes: false,
      metadata: { supabaseUserId: user.id, env: 'test' },
    });

    console.log('checkout_session_created', { userId: user.id, sessionId: session.id });
    return jsonResponse(200, { url: session.url });
  } catch (err) {
    console.error('checkout_session_error', err.message);
    return jsonResponse(500, { error: 'CHECKOUT_SESSION_ERROR' });
  }
};

