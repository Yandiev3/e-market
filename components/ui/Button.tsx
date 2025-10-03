// components/ui/Button.tsx
import React from 'react';
import Link from 'next/link';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

interface ButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: never;
}

interface LinkButtonProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
}

type Props = ButtonProps | LinkButtonProps;

const Button: React.FC<Props> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  href,
  onClick,
  disabled = false,
  className = '',
  type,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/20 shadow-sm hover:shadow-md',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/20 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-accent/20',
    ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-accent/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  // Если передан href, рендерим Link
  if (href) {
    const { type: _, disabled: __, href: ___, ...linkProps } = props as LinkButtonProps;
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...linkProps}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Загрузка...
          </div>
        ) : (
          children
        )}
      </Link>
    );
  }

  // Иначе рендерим button
  const { href: __, ...buttonProps } = props as ButtonProps;
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      type={type as 'button' | 'submit' | 'reset' | undefined}
      {...buttonProps}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Загрузка...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;