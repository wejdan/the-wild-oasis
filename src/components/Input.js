import React from "react";

const Input = React.forwardRef(
  ({ id, label, value, onChange, ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-bold text-gray-600 dark:text-white"
        >
          {label}
        </label>
        <input
          ref={ref} // Attach the forwarded ref to the input element
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="appearance-none dark:border-gray-500  dark:bg-gray-800 dark:text-white  relative block w-full px-3 py-2 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 text-sm"
          {...rest} // Spread the rest of the props
        />
      </div>
    );
  }
);

export default Input;
