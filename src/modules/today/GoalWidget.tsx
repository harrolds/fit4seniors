import React from 'react';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';

export const GoalWidget: React.FC = () => {
  const { goTo } = useNavigation();

  return (
    <div className="f4s-widget f4s-goal">
      <h2>Dein heutiges Ziel</h2>
      <p>Bleib aktiv und gesund.</p>
      <div className="f4s-goal__actions">
        <Button variant="secondary" onClick={() => goTo('/exercises')}>
          Übungen öffnen
        </Button>
      </div>
    </div>
  );
};

