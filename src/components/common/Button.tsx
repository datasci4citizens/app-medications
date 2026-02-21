// src/components/common/Button.tsx

import type { ButtonHTMLAttributes } from 'react';
import { COLORS } from '../../constants';

// ============================================
// TIPOS
// ============================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

// ============================================
// ESTILOS BASE
// ============================================

const baseStyles = 'font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

const variantStyles = {
  primary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-md',
  success: 'bg-green-500 text-white hover:bg-green-600 shadow-md',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizeStyles = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2.5 text-base',
  large: 'px-6 py-3.5 text-lg',
};

// ============================================
// COMPONENTE
// ============================================

export function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Carregando...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}