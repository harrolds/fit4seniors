import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MoreScreen } from './MoreScreen';

export const MoreRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MoreScreen />} />
      <Route path="*" element={<Navigate to="/more" replace />} />
    </Routes>
  );
};

