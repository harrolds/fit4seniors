import React, { forwardRef } from 'react';
import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import './primitives.css';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {}

export const List = forwardRef<HTMLUListElement, ListProps>(({ className, children, ...rest }, ref) => {
  const classes = ['ui-list', className].filter(Boolean).join(' ');

  return (
    <ul ref={ref} className={classes} {...rest}>
      {children}
    </ul>
  );
});

List.displayName = 'List';

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  title?: ReactNode;
  subtitle?: ReactNode;
  rightSlot?: ReactNode;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ title, subtitle, rightSlot, className, children, ...rest }, ref) => {
    const classes = ['ui-list-item', className].filter(Boolean).join(' ');
    const isStructured = Boolean(title || subtitle || rightSlot);

    if (!isStructured) {
      return (
        <li ref={ref} className={classes} {...rest}>
          {children}
        </li>
      );
    }

    return (
      <li ref={ref} className={classes} {...rest}>
        <div className="ui-list-item__content">
          <div className="ui-list-item__text">
            {title ? <p className="ui-list-item__title">{title}</p> : null}
            {subtitle ? <p className="ui-list-item__subtitle">{subtitle}</p> : null}
            {children ? <div className="ui-list-item__extra">{children}</div> : null}
          </div>
          {rightSlot ? <div className="ui-list-item__right">{rightSlot}</div> : null}
        </div>
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';
