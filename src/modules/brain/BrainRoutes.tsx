import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { BrainOverviewScreen } from './screens/BrainOverviewScreen';
import { DedicatedSessionScreen } from './screens/DedicatedSessionScreen';
import { BrainCategoryScreen } from './screens/BrainCategoryScreen';

export const BrainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<BrainOverviewScreen />} />
      <Route path="category/:categoryId" element={<BrainCategoryScreen />} />
      <Route path="session/:exerciseId" element={<DedicatedSessionScreen />} />
      <Route path="*" element={<Navigate to="/brain" replace />} />
    </Routes>
  );
};



