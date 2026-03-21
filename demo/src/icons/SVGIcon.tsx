import React from 'react';

interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  disabled?: boolean;
  variant?: string;
  size?: number;
}

const SVGIcon = ({ disabled = false, variant, size, style, ...props }: SVGIconProps) => (
  <svg
    data-variant={variant}
    data-disabled={disabled}
    style={{
      fill: variant === 'primary' ? 'var(--idz-accent, #7c83d4)' : 'var(--idz-icon-color, #ffffff)',
      opacity: disabled ? 0.5 : undefined,
      width: size ?? 24,
      height: size ?? 24,
      display: 'inline-block',
      flexShrink: 0,
      cursor: disabled ? 'default' : 'pointer',
      ...style,
    }}
    {...props}
  />
);

export default SVGIcon;
