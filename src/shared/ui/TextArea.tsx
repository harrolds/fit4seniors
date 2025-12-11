import React from 'react';
import type { CSSProperties, TextareaHTMLAttributes } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ style, rows = 4, ...rest }, ref) => {
    const theme = useTheme();
    const { radii, spacing, typography, components } = theme;
    const input = components.input;

    const baseStyle: CSSProperties = {
      width: '100%',
      minHeight: '5rem',
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
      resize: 'vertical',
      outline: 'none',
    };

    return <textarea ref={ref} rows={rows} {...rest} style={{ ...baseStyle, ...style }} />;
  }
);

TextArea.displayName = 'TextArea';
