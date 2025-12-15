import React, { useEffect } from 'react';
import './settings.css';
import { SettingsRoutes } from './SettingsRoutes';
import { applySettingsToDocument, ensureSettingsHydrated } from './settingsStorage';

export const SettingsModule: React.FC = () => {
  useEffect(() => {
    const current = ensureSettingsHydrated();
    applySettingsToDocument(current);
  }, []);

  return <SettingsRoutes />;
};

