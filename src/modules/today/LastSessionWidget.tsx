import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';

export const LastSessionWidget: React.FC = () => {
  return (
    <Card className="f4s-widget-card f4s-last-session-widget">
      <div className="f4s-widget-last-session">
        <div>
          <p className="f4s-widget-eyebrow">Zuletzt</p>
          <h2 className="f4s-widget-title">Letzte Trainingseinheit</h2>
          <p className="f4s-widget-subtitle">11.1. – 16:00</p>
        </div>
        <Badge variant="accent">Aktiv</Badge>
      </div>
    </Card>
  );
};
