import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CompletionScreen } from './CompletionScreen';

export const CompletionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CompletionScreen />} />
      <Route path="*" element={<Navigate to="/completion" replace />} />
    </Routes>
  );
};

