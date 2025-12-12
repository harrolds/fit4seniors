import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './primitives.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth, className, children, ...rest }, ref) => {
    const classes = [
      'ui-button',
      `ui-button--${variant}`,
      fullWidth ? 'ui-button--full' : null,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={rest.type ?? 'button'}
        {...rest}
        className={classes}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
