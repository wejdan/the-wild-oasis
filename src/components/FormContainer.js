import React from "react";
import { useSelector } from "react-redux";

function FormContainer({ children }) {
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);

  return (
    <div
      className={`rounded-md ${
        isDarkMode ? "borderBNotLast-dark" : "borderBNotLast"
      } space-y-5 `}
    >
      {children}
    </div>
  );
}

export default FormContainer;
