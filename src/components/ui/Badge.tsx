import React, { HTMLAttributes } from 'react';
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}
export function Badge({
  className = '',
  variant = 'neutral',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: 'bg-ajo-100 text-ajo-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}>
      
      {children}
    </span>);

}