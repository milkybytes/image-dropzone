import React from 'react';
import styles from './SVGIcon.module.css';

export interface SVGIconProps {
  children?: React.ReactNode;
  variant?: string;
  disabled?: boolean;
  fill?: string;
  className?: string;
  size?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  [key: string]: any;
}

const SVGIcon = ({ children, variant, disabled = false, fill, className, size, ...props }: SVGIconProps) => {
  const style: React.CSSProperties = {
    ...(fill ? { fill } : {}),
    ...(size ? { width: `${size}px`, height: `${size}px` } : {}),
  };

  return (
    <svg
      className={`${styles.SVGIcon} ${className || ''}`}
      data-variant={variant}
      data-disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </svg>
  );
};

export default SVGIcon;
