import React, { forwardRef } from 'react';
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-card shadow-card p-6 ${hoverable ? 'transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer' : ''} ${className}`}
        {...props}>
        
        {children}
      </div>);

  }
);
Card.displayName = 'Card';