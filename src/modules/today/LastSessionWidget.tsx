import React from 'react';
import { Card } from '../../shared/ui/Card';

export const LastSessionWidget: React.FC = () => {
  return (
    <Card className="f4s-widget f4s-last-session">
      <p className="f4s-widget__eyebrow">Zuletzt</p>
      <h2>Letzte Trainingseinheit</h2>
      <p>11.1. – 16:00</p>
    </Card>
  );
};

