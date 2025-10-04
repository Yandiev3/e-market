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
  const handleChange = (selectedValue: string) => {
    onValueChange?.(selectedValue);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: value === child.props.value,
            onChange: () => handleChange(child.props.value),
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
  onChange?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  checked,
  onChange,
  className = '',
  children,
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <input
        type="radio"
        value={value}
        id={id}
        checked={checked}
        onChange={onChange}
        className="
          h-4 w-4 text-primary border-gray-300 focus:ring-primary 
          focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
          cursor-pointer
        "
      />
      {children}
    </div>
  );
};