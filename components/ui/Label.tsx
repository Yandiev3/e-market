// components/ui/label.tsx
import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ 
  children, 
  htmlFor, 
  className = '', 
  ...props 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-semibold text-foreground leading-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};