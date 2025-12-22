import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './primitives.css';

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2' | 'p';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  as,
  className,
  ...rest
}) => {
  const classes = ['ui-section-header', className].filter(Boolean).join(' ');
  const TitleTag = as ?? 'p';

  return (
    <div className={classes} {...rest}>
      <div className="ui-section-header__titles">
        <TitleTag className="ui-section-header__title">{title}</TitleTag>
        {subtitle ? <p className="ui-section-header__subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="ui-section-header__action">{action}</div> : null}
    </div>
  );
};

