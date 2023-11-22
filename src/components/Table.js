import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTable, useSortBy, usePagination } from "react-table";
function Table({
  columns,
  data,
  onRowClick,
  initialState = { pageIndex: 0, pageSize: 10 },
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of 'rows', we'll use page
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState, // You can adjust the initial page index and page size here
    },

    useSortBy,
    usePagination
  );
  const { pageIndex, pageSize } = state;
  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200     "
      >
        <thead className=" ">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className=" font-medium text-gray-600 uppercase tracking-wider  "
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-3 px-6 text-left text-bold  "
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          className="bg-white divide-y divide-gray-200"
          {...getTableBodyProps()}
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                className={
                  page.indexOf(row) === 0
                    ? "rounded-t-lg hover:bg-gray-50"
                    : page.indexOf(row) === page.length - 1
                    ? "rounded-b-lg hover:bg-gray-50"
                    : "hover:bg-gray-50"
                }
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(cell.row.original.id);
                      }
                    }}
                    className={` select-none ${
                      onRowClick ? "cursor-pointer" : ""
                    } text-left py-3 px-6`}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center py-2 px-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Showing {pageIndex * pageSize + 1} to{" "}
          {pageIndex * pageSize + page.length} of {data.length} results
        </span>
        <div className="flex">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`ml-0.5 px-4 flex items-center py-2 bg-transparent cursor-pointer text-gray-700 hover:bg-gray-100 ${
              !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeft className="mr-2" /> <span>Previous</span>
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`ml-0.5 px-4 py-2 flex items-center bg-transparent cursor-pointer text-gray-700 hover:bg-gray-100 ${
              !canNextPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>Next</span> <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Table;
