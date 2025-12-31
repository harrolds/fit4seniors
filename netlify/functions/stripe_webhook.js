const Stripe = require('stripe');

const inMemoryEntitlements = new Set();

const getStripeClient = () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  return new Stripe(secret, { apiVersion: '2024-06-20' });
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    // Dev fallback: accept webhook but do not persist.
    return { statusCode: 200, body: JSON.stringify({ warning: 'Webhook ignored; Stripe not configured.' }) };
  }

  const signature = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: `Webhook error: ${err.message}` }) };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const localUserId = session.metadata?.localUserId;
    if (localUserId) {
      inMemoryEntitlements.add(localUserId);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

