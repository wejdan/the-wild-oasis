// Filter component
import React, { useEffect, useState, useMemo } from "react";
import FilterButtons from "./FilterButtons";
import { useSearchParams } from "react-router-dom";

function Filter({ data, filterMappings, filterName, onFilteredDataChange }) {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get(filterName) || "All";
  console.log("searchParams", filterValue);
  // Compute the filtered data using useMemo to avoid unnecessary recomputation
  const filteredData = useMemo(() => {
    const filterFunction = filterMappings[filterValue];
    return filterFunction ? data.filter(filterFunction) : data;
  }, [data, filterValue, filterMappings]);

  // Call the callback function whenever the filtered data changes
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData);
    }
  }, [filteredData, onFilteredDataChange]);

  return (
    <FilterButtons
      filterName={filterName}
      filtersLists={Object.keys(filterMappings)}
    />
  );
}

export default Filter;
