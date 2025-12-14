import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RemindersSettingsScreen } from './screens/RemindersSettingsScreen';

export const RemindersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<RemindersSettingsScreen />} />
      <Route path="*" element={<Navigate to="/reminders" replace />} />
    </Routes>
  );
};
