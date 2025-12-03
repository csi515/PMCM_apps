import React from 'react';
import FormField from './FormField';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

function FormTextarea({
  label,
  required = false,
  error,
  hint,
  containerClassName = '',
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <textarea
        className={`input-field ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
    </FormField>
  );
}

export default FormTextarea;

