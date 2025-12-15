import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SettingsOverviewScreen } from './screens/SettingsOverviewScreen';
import { SettingsDetailScreen } from './screens/SettingsDetailScreen';
import { InfoAndHelpScreen } from './screens/InfoAndHelpScreen';

export const SettingsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SettingsOverviewScreen />} />
      <Route path="help" element={<InfoAndHelpScreen />} />
      <Route path=":section" element={<SettingsDetailScreen />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
};

