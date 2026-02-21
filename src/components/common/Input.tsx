// src/components/common/Input.tsx

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react'

// ============================================
// TIPOS
// ============================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

// ============================================
// COMPONENTE
// ============================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Ícone (se tiver) */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={`
              p-4 rounded-lg border text-lg outline-none transition-all
              ${icon ? 'pl-12' : ''}
              ${hasError 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }
              ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${fullWidth ? 'w-full' : ''}
              ${className}
            `}
            {...props}
          />
        </div>

        {/* Helper Text ou Error */}
        {(error || helperText) && (
          <p
            className={`text-sm ${
              hasError ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';