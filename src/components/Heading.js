import React from "react";

function Heading({ children }) {
  return (
    <div className=" text-gray-700  my-8 font-bold text-3xl ">
      <span> {children}</span>
    </div>
  );
}

export default Heading;
