import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
  {
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
  },
  ref) =>
  {
    const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      primary:
      'bg-ajo-600 text-white hover:bg-ajo-700 focus:ring-ajo-600 shadow-sm',
      secondary:
      'bg-white text-ink border border-gray-200 hover:bg-gray-50 focus:ring-gray-200 shadow-sm',
      ghost:
      'bg-transparent text-ink-secondary hover:bg-gray-100 hover:text-ink focus:ring-gray-200',
      danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm'
    };
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-base',
      lg: 'h-14 px-6 text-lg'
    };
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}>
        
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>);

  }
);
Button.displayName = 'Button';