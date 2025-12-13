import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './primitives.css';

export type ModuleCardTone = 'module-1' | 'module-2' | 'module-3' | 'module-4' | 'module-5' | 'accent';

export interface ModuleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: ModuleCardTone;
  icon?: ReactNode;
  rightSlot?: ReactNode;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  subtitle,
  tone = 'module-1',
  icon,
  rightSlot,
  children,
  className,
  ...rest
}) => {
  const classes = ['ui-module-card', className].filter(Boolean).join(' ');

  return (
    <div className={classes} data-tone={tone} {...rest}>
      {icon ? <div className="ui-module-card__icon" aria-hidden="true">{icon}</div> : null}
      <div className="ui-module-card__content">
        <div className="ui-module-card__header">
          <div>
            <p className="ui-module-card__title">{title}</p>
            {subtitle ? <p className="ui-module-card__subtitle">{subtitle}</p> : null}
          </div>
          {rightSlot ? <div className="ui-module-card__right">{rightSlot}</div> : null}
        </div>
        {children ? <div className="ui-module-card__body">{children}</div> : null}
      </div>
    </div>
  );
};

