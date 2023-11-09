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
        'flex items-center gap-x-5 rounded-md border border-orange-300 bg-danger p-5 font-medium text-danger-foreground',
        fullWidth ? 'w-full' : ''
      )}
    >
      <Info size="20" />
      {children}
    </div>
  );
}
