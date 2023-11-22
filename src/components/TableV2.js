import React, { useContext, useState } from "react";
import { createContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTable, useSortBy, usePagination } from "react-table";
const TableContext = createContext();
export function useTableContext() {
  return useContext(TableContext);
}

function Table({
  columns,
  data,
  onRowClick,
  children,
  initialState = { pageIndex: 0, pageSize: 10 },
}) {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState,
    },
    useSortBy,
    usePagination
  );
  return (
    <TableContext.Provider
      value={{ tableInstance, onRowClick, dataLength: data.length }}
    >
      {children}
    </TableContext.Provider>
  );
}
function TableContent({ children }) {
  const { tableInstance } = useTableContext();
  return (
    <table
      {...tableInstance.getTableProps()}
      className="min-w-full divide-y divide-gray-200 dark:divide-slate-800"
    >
      {children}
    </table>
  );
}
function TableHeader() {
  const { tableInstance } = useTableContext();

  return (
    <thead className="dark:bg-black ">
      {tableInstance.headerGroups.map((headerGroup) => (
        <tr
          {...headerGroup.getHeaderGroupProps()}
          className="font-medium text-gray-600 dark:text-white uppercase tracking-wider"
        >
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
              className="py-3 px-6 text-left text-bold"
            >
              {column.render("Header")}
              <span>
                {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
              </span>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

function TableBody() {
  const { tableInstance } = useTableContext();
  const { page, prepareRow, onRowClick } = tableInstance;
  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-slate-700/20">
      {page.map((row) => {
        prepareRow(row);
        return (
          <tr className={getRowClassNames(page, row)} {...row.getRowProps()}>
            {row.cells.map((cell) => (
              <td
                onClick={() => onRowClickHandler(onRowClick, cell)}
                className={getCellClassNames(onRowClick)}
                {...cell.getCellProps()}
              >
                {cell.render("Cell")}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

function TablePagination() {
  const { tableInstance, dataLength } = useTableContext();

  const {
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
  } = tableInstance;
  const { pageIndex, pageSize } = state;

  return (
    <div className="flex justify-between items-center py-2 px-4 border-t border-gray-200 dark:divide-slate-800">
      <span className="text-sm text-gray-500">
        Showing {pageIndex * pageSize + 1} to{" "}
        {pageIndex * pageSize + tableInstance.page.length} of {dataLength}{" "}
        results
      </span>
      <div className="flex">
        {/* Previous Button */}
        <PaginationButton
          action={previousPage}
          canExecuteAction={canPreviousPage}
          direction="previous"
        />

        {/* Next Button */}
        <PaginationButton
          action={nextPage}
          canExecuteAction={canNextPage}
          direction="next"
        />
      </div>
    </div>
  );
}

function PaginationButton({ action, canExecuteAction, direction }) {
  return (
    <button
      onClick={action}
      disabled={!canExecuteAction}
      className={`ml-0.5 px-4 flex items-center py-2 bg-transparent cursor-pointer text-gray-700 hover:bg-gray-100 ${
        !canExecuteAction ? "opacity-50 cursor-not-allowed" : ""
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

function getRowClassNames(page, row) {
  const rowIndex = page.indexOf(row);
  if (rowIndex === 0)
    return "rounded-t-lg hover:bg-gray-50 dark:hover:bg-gray-700";
  if (rowIndex === page.length - 1)
    return "rounded-b-lg hover:bg-gray-50 dark:hover:bg-gray-700";
  return "hover:bg-gray-50 dark:hover:bg-gray-700";
}

function getCellClassNames(onRowClick) {
  return `select-none ${
    onRowClick ? "cursor-pointer" : ""
  } text-left py-3 px-6`;
}

function onRowClickHandler(onRowClick, cell) {
  if (onRowClick) {
    onRowClick(cell.row.original.id);
  }
}

Table.TableContent = TableContent;
Table.TableHeader = TableHeader;
Table.TableBody = TableBody;
Table.TablePagination = TablePagination;

export default Table;
