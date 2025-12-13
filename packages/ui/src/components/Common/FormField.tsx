import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label} {required && <span className="text-error-600">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-error-600">{error}</p>
      )}
    </div>
  );
}

export default FormField;

