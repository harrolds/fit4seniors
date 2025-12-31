export type DistributionChannel = 'web' | 'play' | 'ios';

const resolveChannel = (): DistributionChannel => {
  const raw = import.meta.env.VITE_DISTRIBUTION_CHANNEL;
  if (raw === 'web' || raw === 'play' || raw === 'ios') {
    return raw;
  }
  return 'web';
};

export const DISTRIBUTION_CHANNEL: DistributionChannel = resolveChannel();

