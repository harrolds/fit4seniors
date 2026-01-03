const Stripe = require('stripe');

const getStripeClient = () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    const error = new Error('Stripe secret key not configured.');
    error.statusCode = 500;
    throw error;
  }

  return new Stripe(secret, { apiVersion: '2024-06-20' });
};

module.exports = { getStripeClient };

