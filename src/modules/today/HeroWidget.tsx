import React from 'react';
import { Card } from '../../shared/ui/Card';

export const HeroWidget: React.FC = () => {
  return (
    <Card className="f4s-widget f4s-hero">
      <p className="f4s-widget__eyebrow">Heute</p>
      <h1>Guten Morgen!</h1>
      <p>Bereit für heute?</p>
    </Card>
  );
};

