import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from './ui/button';

interface ButtonProps extends ShadcnButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant, size, ...props }) => {
  const enhancedClassName = `${className} transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95`;
  
  return (
    <ShadcnButton className={enhancedClassName} variant={variant} size={size} {...props}>
      {children}
    </ShadcnButton>
  );
};

export default Button;