import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ModuleLanding } from '../../features/trainieren';

export const BrainModule: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ModuleLanding moduleIdOverride="brain" />} />
      <Route path="*" element={<Navigate to="/trainieren/brain" replace />} />
    </Routes>
  );
};


