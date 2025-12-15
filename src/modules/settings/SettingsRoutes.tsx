import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SettingsOverviewScreen } from './screens/SettingsOverviewScreen';

export const SettingsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SettingsOverviewScreen />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
};
