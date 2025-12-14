import React, { useEffect } from 'react';
import './reminders.css';
import { RemindersRoutes } from './RemindersRoutes';
import { ensureRemindersHydrated } from './remindersStorage';
import { useRemindersScheduler } from './remindersScheduler';

export const RemindersModule: React.FC = () => {
  useEffect(() => {
    ensureRemindersHydrated();
  }, []);

  useRemindersScheduler();

  return <RemindersRoutes />;
};

export const RemindersBootstrap: React.FC = () => {
  useEffect(() => {
    ensureRemindersHydrated();
  }, []);

  useRemindersScheduler();

  return null;
};
