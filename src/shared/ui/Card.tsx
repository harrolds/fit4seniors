import React from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ style, children, ...rest }) => {
  const theme = useTheme();
  const { spacing, radii, shadows, components } = theme;
  const { card } = components;

  const baseStyle: CSSProperties = {
    backgroundColor: card.background,
    borderRadius: radii.md,
    padding: spacing.lg,
    boxShadow: card.shadow ?? shadows.sm,
    border: `1px solid ${card.border}`,
  };

  return (
    <div {...rest} style={{ ...baseStyle, ...style }}>
      {children}
    </div>
  );
};
