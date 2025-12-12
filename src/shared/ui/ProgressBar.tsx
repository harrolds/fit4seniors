import React from 'react';
import type { HTMLAttributes } from 'react';
import './primitives.css';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className, ...rest }) => {
  const safeMax = max <= 0 ? 1 : max;
  const ratio = Math.min(Math.max(value / safeMax, 0), 1);
  const classes = ['ui-progress', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.round(ratio * safeMax)}
      {...rest}
    >
      <div className="ui-progress__track">
        <div className="ui-progress__value" style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
};

