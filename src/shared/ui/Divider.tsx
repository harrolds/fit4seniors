import React from 'react';
import type { HTMLAttributes } from 'react';
import './primitives.css';

export type DividerProps = HTMLAttributes<HTMLHRElement>;

export const Divider: React.FC<DividerProps> = ({ className, ...rest }) => {
  const classes = ['ui-divider', className].filter(Boolean).join(' ');
  return <hr {...rest} className={classes} />;
};

