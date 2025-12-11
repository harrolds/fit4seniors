import React from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  iconBackground?: string;
}

export const Card: React.FC<CardProps> = ({ style, icon, iconBackground, children, ...rest }) => {
  const theme = useTheme();
  const { spacing, components } = theme;
  const { card } = components;

  const baseStyle: CSSProperties = {
    backgroundColor: card.background ?? '#ffffff',
    borderRadius: '28px',
    padding: '22px',
    boxShadow: card.shadow ?? '0 4px 14px rgba(0,0,0,0.06)',
    border: 'none',
  };

  const iconWrapperStyle: CSSProperties = {
    width: '64px',
    height: '64px',
    minWidth: '64px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '24px',
    backgroundColor: iconBackground ?? 'rgba(27, 58, 87, 0.08)',
  };

  const content = icon ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
      <div style={iconWrapperStyle}>{icon}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  ) : (
    children
  );

  return (
    <div {...rest} style={{ ...baseStyle, ...style }}>
      {content}
    </div>
  );
};
