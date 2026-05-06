import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, id, type = 'text', className = '', ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200
          placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 bg-white'
          }
          ${className}
        `}
        {...props}
      />
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

Input.displayName = 'Input';
export default Input;
