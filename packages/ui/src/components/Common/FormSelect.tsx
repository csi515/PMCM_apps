import React from 'react';
import FormField from './FormField';
import { cn } from '../../utils';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options: Option[];
  containerClassName?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, required, error, hint, options, containerClassName, className, ...props }, ref) => {
    return (
      <FormField
        label={label}
        required={required}
        error={error}
        hint={hint}
        className={containerClassName}
      >
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);
FormSelect.displayName = "FormSelect";

export default FormSelect;

