import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, id, className = '', children, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 text-red-900'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 text-gray-900'
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
