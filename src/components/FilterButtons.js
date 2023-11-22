import { useSearchParams } from "react-router-dom";

function FilterButtons({ filterName, filtersLists, defaultValue = "All" }) {
  const [searchParams, setSearchParam] = useSearchParams();
  const filterValue = searchParams.get(filterName) || defaultValue;
  return (
    <div className="flex py-1 px-1 items-center bg-white dark:bg-gray-800  shadow-sm rounded-md">
      {filtersLists.map((filter) => (
        <button
          key={filter}
          className={`text-sm px-3 py-1 rounded-md transition-all duration-100 ${
            filterValue === filter
              ? "bg-primary text-white dark:bg-white dark:text-black"
              : "text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-200 "
          }`}
          onClick={() => {
            searchParams.set(filterName, filter);
            setSearchParam(searchParams);
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
export default FilterButtons;
