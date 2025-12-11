import React from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';

type BadgeVariant = 'default' | 'accent' | 'outline' | 'level';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', style, children, ...rest }) => {
  const theme = useTheme();
  const { colors, spacing, typography } = theme;

  let backgroundColor: CSSProperties['backgroundColor'] = 'rgba(27, 58, 87, 0.06)';
  let borderColor: CSSProperties['borderColor'] = 'transparent';
  let color: CSSProperties['color'] = colors.textPrimary;

  if (variant === 'accent') {
    backgroundColor = '#e6f0ec';
    color = colors.primary;
  }

  if (variant === 'level') {
    backgroundColor = '#1b3a57';
    color = '#ffffff';
  }

  if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderColor = colors.border;
  }

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: '999px',
    backgroundColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor,
    color,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.normal,
    whiteSpace: 'nowrap',
  };

  return (
    <span {...rest} style={{ ...baseStyle, ...style }}>
      {children}
    </span>
  );
};
