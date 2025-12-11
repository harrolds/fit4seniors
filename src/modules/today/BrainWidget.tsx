import React from 'react';
import { Card } from '../../shared/ui/Card';

export const BrainWidget: React.FC = () => {
  return (
    <Card className="f4s-widget f4s-brain">
      <p className="f4s-widget__eyebrow">Gehirn</p>
      <h2>Gehirn training</h2>
      <p>Starte eine kurze mentale Übung.</p>
    </Card>
  );
};

