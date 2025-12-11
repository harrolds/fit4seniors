import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';

export const GoalWidget: React.FC = () => {
  const { goTo } = useNavigation();

  return (
    <Card className="f4s-widget f4s-goal">
      <p className="f4s-widget__eyebrow">Ziel des Tages</p>
      <h2>Aktiv bleiben</h2>
      <p>Bleib aktiv und gesund.</p>
      <div className="f4s-goal__actions">
        <Button variant="secondary" fullWidth onClick={() => goTo('/exercises')}>
          Übungen öffnen
        </Button>
      </div>
    </Card>
  );
};

