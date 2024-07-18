import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function MyProtectedDataPagination(props: {
  count: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: props.count + 1 }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page} className="size-8">
            <PaginationLink
              isActive={page === props.currentPage}
              onClick={() => {
                props.onPageChange(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
