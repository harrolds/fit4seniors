import type { UserSession } from '../user/userSession';

export type AccessDecision =
  | { allowed: true }
  | { allowed: false; reason: 'premium_required'; context: { feature: 'training'; trainingId: string } };

export const canStartTraining = (
  session: UserSession,
  training: { id: string; requiresPremium: boolean },
): AccessDecision => {
  if (session.admin.isAdmin) {
    return { allowed: true };
  }

  if (!training.requiresPremium) {
    return { allowed: true };
  }

  if (session.entitlements.isPremium) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'premium_required', context: { feature: 'training', trainingId: training.id } };
};

