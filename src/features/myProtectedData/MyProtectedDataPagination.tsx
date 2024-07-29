import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.tsx';

export function MyProtectedDataPagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const hasTwoEllipsis =
    pageNumbers.filter((item) => item === 'ellipsis').length === 2;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            onClick={() => onPageChange(1)}
            // @ts-expect-error Why is this 'disabled' not valid here? :(
            disabled={currentPage === 1}
          />
        </PaginationItem>
        <PaginationItem className={!hasTwoEllipsis ? 'pr-5' : ''}>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            // @ts-expect-error Why is this 'disabled' not valid here? :(
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => (
          <PaginationItem key={index}>
            {pageNumber === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber as number)}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem className={!hasTwoEllipsis ? 'pl-5' : ''}>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            // @ts-expect-error Why is this 'disabled' not valid here? :(
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            onClick={() => onPageChange(totalPages)}
            // @ts-expect-error Why is this 'disabled' not valid here? :(
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
