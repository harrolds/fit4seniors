import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { TrainierenHub } from './TrainierenHub';
import { ModuleLanding } from './ModuleLanding';
import { TrainingDetail } from './TrainingDetail';
import './trainieren.css';

export const TrainierenModule: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TrainierenHub />} />
      <Route path=":moduleId" element={<ModuleLanding />} />
      <Route path=":moduleId/:trainingId/:intensity" element={<TrainingDetail />} />
      <Route path="*" element={<Navigate to="/trainieren" replace />} />
    </Routes>
  );
};


