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
  const tableInstance = useTable({
    columns,
    data,
    initialState,
  });
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
      className="min-w-full divide-y divide-gray-200 dark:divide-gray-900   "
    >
      {children}
    </table>
  );
}
function TableHeader() {
  const { tableInstance } = useTableContext();

  return (
    <thead className=" dark:bg-black ">
      {tableInstance.headerGroups.map((headerGroup) => (
        <tr
          {...headerGroup.getHeaderGroupProps()}
          className="font-medium text-gray-600 dark:text-white uppercase tracking-wider"
        >
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps()}
              className="py-3 px-6 text-left text-bold"
            >
              {column.render("Header")}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

function TableBody() {
  const { tableInstance, onRowClick } = useTableContext();
  const { rows, prepareRow } = tableInstance;
  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-slate-700/20 ">
      {rows.map((row) => {
        prepareRow(row);
        return (
          <tr className={getRowClassNames(rows, row)} {...row.getRowProps()}>
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
  console.log(cell);

  if (onRowClick) {
    onRowClick(cell.row.original.id);
  }
}

Table.TableContent = TableContent;
Table.TableHeader = TableHeader;
Table.TableBody = TableBody;

export default Table;
