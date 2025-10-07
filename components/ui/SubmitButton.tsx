// components/ui/SubmitButton.tsx
import React from 'react';

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`
        w-full bg-primary hover:bg-primary/90 text-primary-foreground 
        py-3 px-6 font-medium rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
        focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed 
        inline-flex items-center justify-center text-base shadow-sm hover:shadow-md
        disabled:hover:shadow-sm
        ${className}
      `}
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

export default SubmitButton;