import React from "react";

function Spinner({ size }) {
  return (
    <div class="relative">
      <div
        style={{ width: size, height: size }}
        className="border-primary border-2 rounded-full"
      ></div>
      <div
        style={{ width: size, height: size }}
        className="border-t-transparent border-solid animate-spin  rounded-full border-primary-light border-2 absolute left-0 top-0 "
      ></div>
    </div>
  );
}

export default Spinner;
