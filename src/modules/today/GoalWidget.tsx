import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';

export const GoalWidget: React.FC = () => {
  const { goTo } = useNavigation();

  return (
    <Card className="f4s-widget-card f4s-goal-widget">
      <p className="f4s-widget-eyebrow">Ziel des Tages</p>
      <h2 className="f4s-widget-title">Aktiv bleiben</h2>
      <p className="f4s-widget-subtitle">Bleib aktiv und gesund.</p>
      <div className="f4s-widget-actions">
        <Button variant="primary" fullWidth onClick={() => goTo('/exercises')}>
          Übungen öffnen
        </Button>
      </div>
    </Card>
  );
};
