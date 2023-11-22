import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const sortingList = [
  "Sort by date (recent first)",
  "Sort by date (earlier first)",
  "Sort by amount (high first)",
  "Sort by amount (low first)",
];
function Dropdown({ sortingOptions }) {
  const [searchParams, setSearchParam] = useSearchParams();
  const sortValue = searchParams.get("sortBy") || null;
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-60 justify-between px-2 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none"
      >
        {sortingOptions[selected].label}
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800  z-20">
          <ul
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {sortingOptions.map((option, i) => (
              <li
                key={option}
                onClick={() => {
                  searchParams.set("sortBy", option.field);
                  setSearchParam(searchParams);
                  searchParams.set("order", option.order);
                  setSearchParam(searchParams);
                  setSelected(i);
                  setIsOpen(false);
                }}
                className="block selected-non cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100"
                role="menuitem"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
