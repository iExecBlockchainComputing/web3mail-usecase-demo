import * as React from 'react';
import { cn } from '@/utils/style.utils.ts';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'placeholder:text-muted-foreground flex h-[46px] w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors hover:border-grey-800 focus-visible:border-grey-800 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
