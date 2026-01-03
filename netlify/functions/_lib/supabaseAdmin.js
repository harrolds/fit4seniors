const { createClient } = require('@supabase/supabase-js');

const getSupabaseAdminClient = () => {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    const error = new Error('Supabase service credentials are not configured.');
    error.statusCode = 500;
    throw error;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

module.exports = { getSupabaseAdminClient };

