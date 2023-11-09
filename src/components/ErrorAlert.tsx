import { Info } from 'react-feather';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

export default function ErrorAlert({
  children,
  fullWidth = false,
}: {
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-danger text-danger-foreground flex items-center gap-x-5 rounded-md border border-orange-300 p-5 font-medium',
        fullWidth ? 'w-full' : ''
      )}
    >
      <Info size="20" />
      {children}
    </div>
  );
}
