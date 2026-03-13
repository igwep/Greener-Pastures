import React, { forwardRef } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label &&
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
          </label>
        }
        <div className="relative">
          {icon &&
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
              {icon}
            </div>
          }
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ajo-600 focus:border-transparent transition-shadow ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'} ${icon ? 'pl-10' : ''} ${className}`}
            {...props} />
          
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>);

  }
);
Input.displayName = 'Input';