import React from 'react';
import { BookOpen } from 'react-feather';
import { cn } from '@/utils/style.utils.ts';

export function DocLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-28 rounded bg-grey-100 px-4 py-3 font-mono text-sm tracking-tighter',
        className
      )}
    >
      <BookOpen size="20" className="mr-2.5 inline-block" />
      {children}
    </div>
  );
}
