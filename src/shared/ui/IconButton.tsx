import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './primitives.css';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
type IconButtonSize = 'md' | 'sm';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  ariaLabel: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', ariaLabel, className, children, ...rest }, ref) => {
    const classes = [
      'ui-button',
      `ui-button--${variant}`,
      'ui-icon-button',
      size === 'sm' ? 'ui-icon-button--sm' : null,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={rest.type ?? 'button'}
        aria-label={ariaLabel}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

