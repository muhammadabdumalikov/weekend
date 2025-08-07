import { useState } from "react";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const renderPage = (pageNumber, isActive = false) => {
    const className = `size-40 flex-center rounded-full cursor-pointer ${
      isActive ? "bg-dark-1 text-white" : "hover:bg-light-2"
    }`;
    return (
      <div key={pageNumber} className="col-auto">
        <div className={className} onClick={() => handlePageClick(pageNumber)}>
          {pageNumber} 
        </div>
      </div>
    );
  };

  const renderPages = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    const pages = pageNumbers.map((pageNumber) =>
      renderPage(pageNumber, pageNumber === currentPage)
    );
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        <div className="col-auto md:order-1">
          <button 
            className={`button -blue-1 size-40 rounded-full border-light ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-light-2'}`}
            onClick={handlePrevClick}
            disabled={currentPage <= 1}
          >
            <i className="icon-chevron-left text-12" />
          </button>
        </div>

        <div className="col-md-auto md:order-3">
          <div className="row x-gap-20 y-gap-20 items-center md:d-none">
            {renderPages()}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <div className="col-auto">
                  <div className="size-40 flex-center rounded-full">...</div>
                </div>
                <div className="col-auto">
                  <div className="size-40 flex-center rounded-full cursor-pointer hover:bg-light-2" onClick={() => handlePageClick(totalPages)}>
                    {totalPages}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="row x-gap-10 y-gap-20 justify-center items-center d-none md:d-flex">
            {renderPages()}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <div className="col-auto">
                  <div className="size-40 flex-center rounded-full">...</div>
                </div>
                <div className="col-auto">
                  <div className="size-40 flex-center rounded-full cursor-pointer hover:bg-light-2" onClick={() => handlePageClick(totalPages)}>
                    {totalPages}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-auto md:order-2">
          <button 
            className={`button -blue-1 size-40 rounded-full border-light ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-light-2'}`}
            onClick={handleNextClick}
            disabled={currentPage >= totalPages}
          >
            <i className="icon-chevron-right text-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
