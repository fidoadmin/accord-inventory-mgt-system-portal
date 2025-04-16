import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div className="pagination flex justify-center mt-2 items-center space-x-2">
      <button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className={`px-3 py-1 bg-primary rounded-lg ${
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "text-white bg-primary hover:opacity-80"
        }`}
      >
        {"<<"}
      </button>

      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 bg-primary rounded-lg ${
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "text-white hover:opacity-80"
        }`}
      >
        {"<"}
      </button>

      <span className="text-sm font-medium">
        {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 bg-primary rounded-lg ${
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "text-white hover:opacity-80"
        }`}
      >
        {">"}
      </button>

      <button
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 bg-primary rounded-lg ${
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "text-white hover:opacity-80"
        }`}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
