import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProfileOverviewScreen } from './screens/ProfileOverviewScreen';
import { ProfileEditScreen } from './screens/ProfileEditScreen';

export const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProfileOverviewScreen />} />
      <Route path="edit" element={<ProfileEditScreen />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};
