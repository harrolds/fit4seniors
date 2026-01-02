import type { TelemetryConfig } from './appConfig';

const readViteEnv = <T = string>(key: string): T | undefined => {
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
    return (import.meta as any).env[key] as T | undefined;
  }
  return undefined;
};

const resolveEnvValue = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  return readViteEnv<string>(key);
};

export const aiApiBaseUrl: string | undefined = resolveEnvValue('VITE_AI_API_BASE_URL');
export const supabaseUrl: string | undefined = resolveEnvValue('VITE_SUPABASE_URL');
export const supabaseAnonKey: string | undefined = resolveEnvValue('VITE_SUPABASE_ANON_KEY');

export const telemetryConfig: TelemetryConfig = {
  endpoint: resolveEnvValue('VITE_TELEMETRY_ENDPOINT'),
  enabledByDefault: true,
  sampleRate: 1,
};

