const { getSupabaseAdminClient } = require('./_lib/supabaseAdmin');
const { getStripeClient } = require('./_lib/stripe');

const jsonResponse = (statusCode, body, allowMethods = 'POST') => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': allowMethods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
  },
  body: JSON.stringify(body),
});

const getRawBody = (event) => {
  if (event.rawBody) return event.rawBody;
  if (event.isBase64Encoded) {
    return Buffer.from(event.body || '', 'base64');
  }
  return event.body;
};

const hasProcessedEvent = async (supabase, eventId) => {
  const { data, error } = await supabase
    .from('stripe_event_log')
    .select('event_id')
    .eq('event_id', eventId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
};

const recordEvent = async (supabase, eventId) => {
  const { error } = await supabase.from('stripe_event_log').insert({ event_id: eventId });
  if (error) {
    // If duplicate (idempotent), surface as already recorded.
    if (error.code === '23505') {
      return false;
    }
    throw error;
  }
  return true;
};

const isPremiumStatus = (status) => ['trialing', 'active'].includes(status);

const resolveUserIdFromSubscription = async (supabase, subscription) => {
  if (subscription?.metadata?.supabaseUserId) return subscription.metadata.supabaseUserId;

  if (!subscription?.id) return null;

  const { data, error } = await supabase
    .from('entitlements')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.user_id || null;
};

const handleCheckoutSessionCompleted = async (stripe, supabase, stripeEvent) => {
  const session = stripeEvent.data.object;
  if (session.mode !== 'subscription') return;

  const subscriptionId = session.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const userId = session.client_reference_id || session.metadata?.supabaseUserId;
  if (!userId) {
    console.warn('checkout.session.completed missing user reference', { eventId: stripeEvent.id });
    return;
  }

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: subscription.id,
        current_period_end: currentPeriodEnd,
        is_premium: isPremiumStatus(subscription.status),
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    throw error;
  }
};

const handleSubscriptionUpdate = async (supabase, subscription) => {
  const userId = await resolveUserIdFromSubscription(supabase, subscription);
  if (!userId) {
    console.warn('subscription update missing user mapping', { subscriptionId: subscription.id });
    return;
  }

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        current_period_end: currentPeriodEnd,
        is_premium: isPremiumStatus(subscription.status),
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    throw error;
  }
};

const handleSubscriptionDeleted = async (supabase, subscription) => {
  const userId = await resolveUserIdFromSubscription(supabase, subscription);
  if (!userId) {
    console.warn('subscription delete missing user mapping', { subscriptionId: subscription.id });
    return;
  }

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        current_period_end: currentPeriodEnd,
        is_premium: false,
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    throw error;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true }, 'POST, OPTIONS');
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, 'POST');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return jsonResponse(500, { error: 'STRIPE_WEBHOOK_SECRET is not configured' });
  }

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message });
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message });
  }

  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  if (!signature) {
    return jsonResponse(400, { error: 'Missing Stripe-Signature header' });
  }

  let stripeEvent;
  try {
    const rawBody = getRawBody(event);
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('stripe_webhook_signature_error', err.message);
    return jsonResponse(400, { error: 'Invalid webhook signature' });
  }

  if (!stripeEvent?.id) {
    return jsonResponse(400, { error: 'Invalid event payload' });
  }

  try {
    const alreadyHandled = await hasProcessedEvent(supabase, stripeEvent.id);
    if (alreadyHandled) {
      return jsonResponse(200, { received: true, duplicate: true });
    }

    await recordEvent(supabase, stripeEvent.id);
  } catch (err) {
    console.error('stripe_webhook_eventlog_error', err.message);
    return jsonResponse(500, { error: 'EVENT_LOG_ERROR' });
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripe, supabase, stripeEvent);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(supabase, stripeEvent.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(supabase, stripeEvent.data.object);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('stripe_webhook_handler_error', { eventId: stripeEvent.id, message: err.message });
    return jsonResponse(500, { error: 'WEBHOOK_HANDLER_ERROR' });
  }

  console.log('stripe_webhook_received', { eventId: stripeEvent.id, type: stripeEvent.type });
  return jsonResponse(200, { received: true });
};

