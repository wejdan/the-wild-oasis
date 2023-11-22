import React from "react";
import Loader from "./Loader";
import Spinner from "./Spinner";

function Button({
  onClick,
  children,
  outline,
  link,
  to,
  disabled,
  loading,
  small,
  warning,
  ...rest
}) {
  let className = "";

  if (outline) {
    className = ` dark:text-white group font-bold relative flex justify-center ${
      small ? "py-1 px-2" : "py-2 px-4"
    } ${small ? "text-xs" : "text-sm"}  rounded-md border-2 `;

    // Add or modify classes based on the disabled prop
    className +=
      disabled || loading
        ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
        : "border-gray-300 text-gray-600 hover:bg-gray-300 hover:text-white dark:hover:text-gray-700";
  } else {
    className = ` group font-bold relative flex justify-center transition-all duration-200 ${
      small ? "py-1 px-1" : "py-2 px-4"
    }  border border-transparent ${small ? "text-xs" : "text-sm"} ${
      small ? "w-20" : ""
    } rounded-md `;

    // Add or modify classes based on the disabled prop
    className +=
      disabled || loading
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : `text-white ${
            warning
              ? " bg-red-500 hover:bg-red-800 focus:ring-red-500"
              : "bg-primary   hover:bg-primary-dark focus:ring-primary"
          }  focus:outline-none focus:ring-2 focus:ring-offset-2 `;
  }

  const spinner = <Spinner size={"20px"} />;

  const content =
    loading && !small ? (
      <>
        <span className="mr-2">{children}</span>
        {spinner}
      </>
    ) : loading && small ? (
      spinner
    ) : (
      children
    );
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
