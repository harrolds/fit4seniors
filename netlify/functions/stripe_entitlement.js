const { getSupabaseAdminClient } = require('./_lib/supabaseAdmin');
const { getUserOrThrow } = require('./_lib/auth');

const jsonResponse = (statusCode, body, allowMethods = 'GET') => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': allowMethods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true }, 'GET, OPTIONS');
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' }, 'GET');
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

  const { data, error } = await supabase
    .from('entitlements')
    .select('is_premium,current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return jsonResponse(500, { error: 'ENTITLEMENT_LOOKUP_FAILED' });
  }

  const isPremium = data?.is_premium === true;
  const currentPeriodEnd = data?.current_period_end
    ? new Date(data.current_period_end).toISOString()
    : null;

  return jsonResponse(200, {
    isPremium,
    currentPeriodEnd,
  });
};

