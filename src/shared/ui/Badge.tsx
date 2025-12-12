import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './primitives.css';

type BadgeVariant = 'neutral' | 'accent' | 'outline' | 'default';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const normalizeVariant = (variant?: BadgeVariant): 'neutral' | 'accent' | 'outline' => {
  if (variant === 'accent') return 'accent';
  if (variant === 'outline') return 'outline';
  return 'neutral';
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', className, children, ...rest }, ref) => {
    const normalized = normalizeVariant(variant);

    const classes = ['ui-badge', className].filter(Boolean).join(' ');

    return (
      <span
        ref={ref}
        {...rest}
        className={classes}
        data-variant={normalized}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
