const isDevPremium = () => process.env.VITE_PREMIUM_DEV === 'true';

exports.handler = async (event) => {
  const localUserId = event.queryStringParameters?.localUserId;
  if (!localUserId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'localUserId required' }) };
  }

  if (isDevPremium()) {
    return { statusCode: 200, body: JSON.stringify({ isPremium: true }) };
  }

  // No persistent store wired yet; default to false but keep endpoint alive.
  return { statusCode: 200, body: JSON.stringify({ isPremium: false }) };
};

