import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProgressOverviewScreen } from './screens/ProgressOverviewScreen';
import { ProgressHistoryScreen } from './screens/ProgressHistoryScreen';
import { ProgressHistoryDetailScreen } from './screens/ProgressHistoryDetailScreen';

export const ProgressRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProgressOverviewScreen />} />
      <Route path="history" element={<ProgressHistoryScreen />} />
      <Route path="history/:id" element={<ProgressHistoryDetailScreen />} />
      <Route path="*" element={<Navigate to="/progress" replace />} />
    </Routes>
  );
};
