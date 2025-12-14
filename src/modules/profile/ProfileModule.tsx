import React, { useEffect } from 'react';
import './profile.css';
import { ProfileRoutes } from './ProfileRoutes';
import { ensureProfileHydrated } from './profileStorage';

export const ProfileModule: React.FC = () => {
  useEffect(() => {
    ensureProfileHydrated();
  }, []);

  return <ProfileRoutes />;
};
