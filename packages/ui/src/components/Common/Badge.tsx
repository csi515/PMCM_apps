import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-700/10',
  success: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-600/20',
  warning: 'bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-600/20',
  danger: 'bg-error-50 text-error-700 ring-1 ring-inset ring-error-600/10',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
  neutral: 'bg-neutral-50 text-neutral-600 ring-1 ring-inset ring-neutral-500/10',
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;

