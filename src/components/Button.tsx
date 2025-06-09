
import React from 'react';
import { Button as ShadcnButton } from './ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <ShadcnButton className={className} {...props}>
      {children}
    </ShadcnButton>
  );
};

export default Button;
