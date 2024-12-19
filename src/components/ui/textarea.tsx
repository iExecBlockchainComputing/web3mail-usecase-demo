import * as React from 'react';
import { cn } from '@/utils/style.utils.ts';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors hover:border-grey-800 focus-visible:border-grey-800 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
