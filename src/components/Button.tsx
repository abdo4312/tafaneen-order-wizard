import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from './ui/button';

interface ButtonProps extends ShadcnButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant, size, ...props }) => {
  return (
    <ShadcnButton className={className} variant={variant} size={size} {...props}>
      {children}
    </ShadcnButton>
  );
};

export default Button;