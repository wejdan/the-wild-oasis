import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function SidebarItem({ text, icon, link }) {
  const location = useLocation();

  // Determine if the current route matches the link
  const isActive = location.pathname === link;
  // console.log(location.pathname, link, isActive);

  return (
    <NavLink
      className={` flex hover:bg-slate-100 hover:text-gray-800 transition-all duration-200 items-center gap-4 py-2 px-6 rounded-md ${
        isActive ? " bg-secondary dark:bg-gray-900 " : "group"
      }`}
      to={link}
    >
      <span
        className={` group-hover:text-gray-800  transition-all duration-200  ${
          isActive ? " text-primary" : " text-gray-600 dark:text-gray-300"
        }`}
      >
        {icon}
      </span>
      <span
        className={` group-hover:text-gray-800 transition-all duration-200 ${
          isActive
            ? " text-black dark:text-white"
            : " text-gray-600 dark:text-gray-300"
        }`}
      >
        {text}
      </span>
    </NavLink>
  );
}

export default SidebarItem;
