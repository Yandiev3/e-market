// components/ui/radio-group.tsx
'use client';

import React from 'react';

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: value === child.props.value,
            onValueChange,
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  id: string;
  checked?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  checked,
  onValueChange,
  className = '',
  children,
}) => {
  return (
    <div className={className}>
      <input
        type="radio"
        value={value}
        id={id}
        checked={checked}
        onChange={() => onValueChange?.(value)}
        className="peer sr-only"
      />
      {children}
    </div>
  );
};