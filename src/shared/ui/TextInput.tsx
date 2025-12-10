import React from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ style, ...rest }, ref) => {
    const theme = useTheme();
    const { radii, spacing, typography, components } = theme;
    const input = components.input;

    const baseStyle: CSSProperties = {
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: radii.md,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: input.border,
      backgroundColor: input.background,
      color: input.text,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSizes.md,
      lineHeight: typography.lineHeights.normal,
      outline: 'none',
    };

    return <input ref={ref} {...rest} style={{ ...baseStyle, ...style }} />;
  }
);

TextInput.displayName = 'TextInput';
