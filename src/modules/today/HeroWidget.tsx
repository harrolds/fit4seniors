import React from 'react';
import { Card } from '../../shared/ui/Card';

export const HeroWidget: React.FC = () => {
  return (
    <Card className="f4s-widget-card f4s-hero-widget">
      <p className="f4s-widget-eyebrow">Heute</p>
      <h2 className="f4s-widget-title">Guten Morgen!</h2>
      <p className="f4s-widget-subtitle">Bereit für heute?</p>
    </Card>
  );
};
