import React from "react";

function PageTitle({ children }) {
  return (
    <h2 className="my-8 text-2xl font-extrabold text-gray-800 dark:text-white">
      {children}
    </h2>
  );
}

export default PageTitle;
