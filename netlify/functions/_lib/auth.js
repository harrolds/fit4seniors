const getBearerToken = (headers = {}) => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
};

const getUserOrThrow = async (supabase, headers = {}) => {
  const token = getBearerToken(headers);
  if (!token) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    const authError = new Error('Unauthorized');
    authError.statusCode = 401;
    throw authError;
  }

  return data.user;
};

module.exports = { getBearerToken, getUserOrThrow };

