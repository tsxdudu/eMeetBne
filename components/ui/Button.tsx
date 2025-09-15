import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const base = 'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    xl: 'text-lg px-8 py-4'
  };

  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md shadow-indigo-900/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100',
    danger: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white',
    outline: 'border border-slate-600/60 hover:bg-slate-800/60 text-slate-200',
    ghost: 'hover:bg-slate-700/50 text-slate-300',
    gradient: 'bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 hover:from-indigo-500 hover:via-fuchsia-500 hover:to-pink-500 text-white shadow-lg shadow-pink-900/25'
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className={clsx('flex-1', loading && 'opacity-0')}>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </span>
      )}
    </button>
  );
};

export default Button;
