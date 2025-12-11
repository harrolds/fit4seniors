import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';

export const BrainWidget: React.FC = () => {
  return (
    <Card className="f4s-widget-card f4s-brain-widget">
      <p className="f4s-widget-eyebrow">Gehirn</p>
      <h2 className="f4s-widget-title">Gehirn training</h2>
      <p className="f4s-widget-subtitle">Starte eine kurze mentale Übung.</p>
      <div className="f4s-widget-actions">
        <Button variant="primary" fullWidth>
          Jetzt starten
        </Button>
      </div>
    </Card>
  );
};
