const Stripe = require('stripe');

const getStripeClient = () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return null;
  }
  return new Stripe(secret, { apiVersion: '2024-06-20' });
};

const resolveOrigin = (headers) => {
  if (headers && headers.origin) return headers.origin;
  if (headers && headers.referer) {
    try {
      const url = new URL(headers.referer);
      return `${url.protocol}//${url.host}`;
    } catch {
      // ignore
    }
  }
  return process.env.URL || 'http://localhost:8888';
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripe = getStripeClient();
  if (!stripe || !process.env.STRIPE_PRICE_ID) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: 'STRIPE_NOT_CONFIGURED' }),
    };
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'INVALID_REQUEST' }),
    };
  }

  const localUserId = body.localUserId || 'anonymous';
  const origin = resolveOrigin(event.headers || {});

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/#/account?premium=success`,
      cancel_url: `${origin}/#/account?premium=cancel`,
      metadata: { localUserId },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

