import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './primitives.css';

type CardVariant = 'default' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...rest }, ref) => {
    const classes = ['ui-card', variant === 'elevated' ? 'ui-card--elevated' : null, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = ['ui-card__header', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = ['ui-card__body', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';
