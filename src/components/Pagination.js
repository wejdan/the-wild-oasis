import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

function PaginationButton({ action, canExecuteAction, direction }) {
  return (
    <button
      onClick={action}
      disabled={!canExecuteAction}
      className={`ml-0.5 px-4 flex items-center py-2 bg-transparent ${
        canExecuteAction ? "cursor-pointer" : ""
      } text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-900 dark:rounded-md ${
        !canExecuteAction ? "opacity-50 dark:hover:bg-slate-800" : ""
      }`}
    >
      {direction === "previous" && (
        <>
          <FaArrowLeft className="mr-2" />
          <span>Previous</span>
        </>
      )}
      {direction === "next" && (
        <>
          <span>Next</span>
          <FaArrowRight className="ml-2" />
        </>
      )}
    </button>
  );
}

function Pagination({ nextPageToken, prevPageToken, numberOfPages }) {
  const [searchParams, setSearchParam] = useSearchParams();
  const pageSize = parseInt(searchParams.get("pageSize")) || 10; // Default page size
  const pageNumber = parseInt(searchParams.get("pageNumber")) || 1; // Default page size

  const [currentPage, setCurrentPage] = useState(1);

  const goToPreviousPage = () => {
    const prev = pageNumber > 1 ? pageNumber - 1 : pageNumber;
    searchParams.set("pageNumber", prev);
    //  searchParams.delete("nextPageToken");
    setSearchParam(searchParams);
    // if (prevPageToken) {
    //   searchParams.set("prevPageToken", prevPageToken);
    //   searchParams.delete("nextPageToken");
    //   setSearchParam(searchParams);
    //   setCurrentPage((p) => p - 1);
    // }
  };

  const goToNextPage = () => {
    const next = pageNumber < numberOfPages ? pageNumber + 1 : pageNumber;
    searchParams.set("pageNumber", next);
    //  searchParams.delete("nextPageToken");
    setSearchParam(searchParams);
    // if (nextPageToken) {
    //   searchParams.set("nextPageToken", nextPageToken);
    //   searchParams.delete("prevPageToken");
    //   setSearchParam(searchParams);

    //   setCurrentPage((p) => p + 1);
    // }
  };

  const changePageSize = (event) => {
    console.log();
    searchParams.set("pageSize", event?.target?.value || pageSize.toString());
    searchParams.set("pageNumber", 1);
    // searchParams.delete("nextPageToken");
    // searchParams.delete("prevPageToken");
    setSearchParam(searchParams);

    setCurrentPage(1);
  };
  useEffect(() => {
    changePageSize();
  }, []);
  return (
    <div className="flex justify-between items-center py-2 px-4 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-900">
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2 dark:text-white">
          Showing {pageNumber} to {numberOfPages === 0 ? "-" : numberOfPages} of
          results
        </span>
        <label htmlFor="page-size" className="text-sm text-gray-500 mr-2">
          Page Size:
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={changePageSize}
          className="text-sm rounded dark:bg-gray-800 dark:text-white  border-gray-300 dark:border-slate-900"
        >
          {[3, 5, 10, 20].map((size) => (
            <option
              className="dark:bg-gray-800 dark:text-white hover:bg-red"
              key={size}
              value={size}
            >
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex">
        {/* Previous Button */}
        <PaginationButton
          action={goToPreviousPage}
          canExecuteAction={pageNumber > 1 && prevPageToken}
          direction="previous"
        />

        {/* Next Button */}
        <PaginationButton
          action={goToNextPage}
          canExecuteAction={pageNumber < numberOfPages && nextPageToken}
          direction="next"
        />
      </div>
    </div>
  );
}

export default Pagination;
