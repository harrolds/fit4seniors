export type UserSession = {
  localUserId: string;
  auth: { status: 'anonymous' | 'authenticated'; email?: string; userId?: string };
  entitlements: { isPremium: boolean };
  admin: { isAdmin: boolean };
};

