import React from 'react';
import type { CSSProperties, ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const { spacing, radii, typography, shadows, components } = theme;
  const buttonTokens = components.button;

  const variantTokens = buttonTokens[variant] ?? buttonTokens.primary;

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: variantTokens.border,
    backgroundColor: variantTokens.background,
    color: variantTokens.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.snug,
    cursor: 'pointer',
    width: fullWidth ? '100%' : undefined,
    boxShadow: variant === 'ghost' ? 'none' : variantTokens.shadow ?? shadows.sm,
    transition:
      'background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, transform 0.1s ease',
  };

  const [isPressed, setIsPressed] = React.useState(false);

  const composedStyle: CSSProperties = {
    ...baseStyle,
    ...(isPressed
      ? {
          transform: 'translateY(1px)',
          backgroundColor: variantTokens.activeBackground ?? variantTokens.background,
          boxShadow: variant === 'ghost' ? 'none' : variantTokens.activeShadow ?? shadows.md,
        }
      : null),
    ...style,
  };

  return (
    <button
      type={rest.type ?? 'button'}
      {...rest}
      style={composedStyle}
      onMouseDown={(event) => {
        setIsPressed(true);
        rest.onMouseDown?.(event);
      }}
      onMouseUp={(event) => {
        setIsPressed(false);
        rest.onMouseUp?.(event);
      }}
      onMouseLeave={(event) => {
        setIsPressed(false);
        rest.onMouseLeave?.(event);
      }}
    >
      {children}
    </button>
  );
};
