// Contract: Renders Material Symbols icon by name with optional fill/size via fontVariationSettings; no custom svg.
import React from 'react';
import type { CSSProperties } from 'react';

type IconProps = {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
  title?: string;
  style?: CSSProperties;
};

export const Icon: React.FC<IconProps> = ({
  name,
  filled = false,
  size = 26,
  className,
  title,
  style,
}) => {
  const classes = ['material-symbols-outlined', className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      title={title}
      aria-hidden={title ? undefined : true}
      style={{
        fontSize: size,
        lineHeight: 1,
        fontVariationSettings: `"FILL" ${filled ? 1 : 0}, "wght" 400, "GRAD" 0, "opsz" 24`,
        ...style,
      }}
    >
      {name}
    </span>
  );
};


