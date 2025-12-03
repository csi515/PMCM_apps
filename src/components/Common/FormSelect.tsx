import React from 'react';
import FormField from './FormField';

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

function FormSelect({
  label,
  required = false,
  error,
  hint,
  options,
  containerClassName = '',
  className = '',
  ...props
}: FormSelectProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <select
        className={`input-field ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
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

export default FormSelect;

