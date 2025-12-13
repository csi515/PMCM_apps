import React from 'react';
import FormField from './FormField';
import { cn } from '../../utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, required, error, hint, containerClassName, className, ...props }, ref) => {
    return (
      <FormField
        label={label}
        required={required}
        error={error}
        hint={hint}
        className={containerClassName}
      >
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </FormField>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export default FormTextarea;

