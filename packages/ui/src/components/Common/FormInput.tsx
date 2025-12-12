import React from 'react';
import FormField from './FormField';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

function FormInput({
  label,
  required = false,
  error,
  hint,
  containerClassName = '',
  className = '',
  ...props
}: FormInputProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <input
        className={`input-field ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
    </FormField>
  );
}

export default FormInput;

