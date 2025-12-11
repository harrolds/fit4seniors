import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WidgetHost } from '../home/WidgetHost';
import { SettingsLayout } from '../settings/SettingsLayout';
import { GlobalSettingsScreen } from '../settings/GlobalSettingsScreen';
import { OfflineScreen } from '../offline/OfflineScreen';
import { ExercisesList } from '../../modules/exercises/ExercisesList';
import { ExerciseDetail } from '../../modules/exercises/ExerciseDetail';

const TodayScreen: React.FC = () => {
  // Voor nu gebruiken we de bestaande WidgetHost als "Heute"-startscherm.
  return <WidgetHost />;
};

interface SimpleScreenProps {
  title: string;
  description: string;
}

const SimpleScreen: React.FC<SimpleScreenProps> = ({ title, description }) => {
  return (
    <div className="f4s-simple-screen">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect naar Heute */}
      <Route path="/" element={<Navigate to="/today" replace />} />
      {/* Fit4Seniors hoofdnavigatie */}
      <Route path="/today" element={<TodayScreen />} />
      <Route path="/exercises" element={<ExercisesList />} />
      <Route path="/exercises/:id" element={<ExerciseDetail />} />
      <Route
        path="/brain"
        element={
          <SimpleScreen
            title="Gehirntraining"
            description="Einfache Aufgaben für ein aktives Gedächtnis."
          />
        }
      />
      <Route
        path="/progress"
        element={
          <SimpleScreen
            title="Fortschritt"
            description="Deine aktiven Tage und Trainings im Überblick."
          />
        }
      />
      <Route
        path="/more"
        element={
          <SimpleScreen
            title="Mehr"
            description="Weitere Bereiche von Fit4Seniors."
          />
        }
      />
      {/* Settings */}
      <Route path="/settings" element={<SettingsLayout />}>
        <Route index element={<GlobalSettingsScreen />} />
      </Route>
      {/* Offline-ervaring */}
      <Route path="/offline" element={<OfflineScreen />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  );
};
