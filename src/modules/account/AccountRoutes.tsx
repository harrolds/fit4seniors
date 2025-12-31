import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AccountScreen } from './AccountScreen';

export const AccountRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AccountScreen />} />
      <Route path="*" element={<Navigate to="/account" replace />} />
    </Routes>
  );
};

