import React from "react";
import styles from "./InvestmentTable.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        Previous
      </button>

      {/* Page numbers with ellipsis */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          // Always show first and last page
          if (page === 1 || page === totalPages) return true;

          // Show current page and 2 pages before/after
          if (page >= currentPage - 2 && page <= currentPage + 2) return true;

          return false;
        })
        .map((page, index, arr) => {
          const prevPage = arr[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;
          return (
            <React.Fragment key={page}>
              {showEllipsis && <span className={styles.ellipsis}>...</span>}
              <button
                className={`${styles.pageButton} ${
                  currentPage === page ? styles.activePage : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;