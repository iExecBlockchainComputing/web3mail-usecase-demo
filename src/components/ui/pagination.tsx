import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'react-feather';
import { cn } from '@/utils/style.utils.ts';
import { ButtonProps, buttonVariants } from './button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <button
    // @ts-expect-error Why is this 'type' not valid? :(
    type="button"
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: 'text',
        size,
      }),
      'rounded-full',
      isActive ? 'bg-[rgba(0,0,0,0.08)]' : '',
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationFirst = ({
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to first page" {...props}>
    <ChevronsLeft className="size-4" />
  </PaginationLink>
);
PaginationFirst.displayName = 'PaginationFirst';

const PaginationPrevious = (
  props: React.ComponentProps<typeof PaginationLink>
) => (
  <PaginationLink aria-label="Go to previous page" {...props}>
    <ChevronLeft className="size-4" />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" {...props}>
    <ChevronRight className="size-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationLast = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to last page" {...props}>
    <ChevronsRight className="size-4" />
  </PaginationLink>
);
PaginationLast.displayName = 'PaginationLast';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex size-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
