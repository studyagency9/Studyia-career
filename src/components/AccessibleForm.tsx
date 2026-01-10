import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Composant Input accessible avec labels et messages d'erreur
 */
export const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, helperText, required, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="flex items-center gap-1">
          {label}
          {required && (
            <span className="text-destructive" aria-label="requis">
              *
            </span>
          )}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Composant Textarea accessible avec labels et messages d'erreur
 */
export const AccessibleTextarea = React.forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ label, error, helperText, required, id, ...props }, ref) => {
    const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="space-y-2">
        <Label htmlFor={textareaId} className="flex items-center gap-1">
          {label}
          {required && (
            <span className="text-destructive" aria-label="requis">
              *
            </span>
          )}
        </Label>
        <Textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';
