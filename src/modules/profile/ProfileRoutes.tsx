import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProfileOverviewScreen } from './screens/ProfileOverviewScreen';
import { ProfileEditScreen } from './screens/ProfileEditScreen';
import { useUserSession } from '../../core/user/userStore';

export const ProfileRoutes: React.FC = () => {
  const session = useUserSession();
  const isGuest = session.auth.status === 'anonymous';

  return (
    <Routes>
      <Route index element={<ProfileOverviewScreen />} />
      <Route path="edit" element={isGuest ? <Navigate to="/login" replace /> : <ProfileEditScreen />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};
