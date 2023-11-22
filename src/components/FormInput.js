import React, { useState, forwardRef } from "react";
import { FaTimes } from "react-icons/fa";

const FormInput = forwardRef(
  (
    { id, label, onChange, textArea, type, field, error, revert, ...rest },
    ref
  ) => {
    // State to store the chosen file name
    const [fileName, setFileName] = useState("");
    //'border-b-1'
    return (
      <div className="flex pb-3 items-center ">
        <label
          htmlFor={id}
          className=" w-60 block text-sm font-bold text-gray-600 dark:text-gray-200"
        >
          {label}
        </label>

        {textArea ? (
          <textarea
            id={id}
            name={id}
            ref={ref}
            onChange={onChange}
            className=" disabled:bg-gray-200 text-gray-400 border-gray-200  appearance-none w-60 relative block px-3 py-2 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 text-sm"
            {...rest}
          />
        ) : type === "file" ? (
          <div className="flex items-center ">
            <label className="relative inline-block  ">
              <input
                type="file"
                id={id}
                name={id}
                ref={ref}
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFileName(selectedFile?.name || "");

                  // Call the onChange from props (passed by Controller) with the actual file
                  field.onChange(selectedFile);
                }}
                {...rest}
              />
              <div className="cursor-pointer group font-bold relative flex justify-center py-2 px-4 border border-transparent text-sm rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                {" "}
                Choose file
              </div>
              {/* Render the chosen file name */}
            </label>
            {fileName && (
              <div className=" flex items-center">
                <span className="ml-3 select-none text-sm text-gray-600 whitespace-nowrap">
                  {fileName.length > 20
                    ? `${fileName.substring(0, 17)}...`
                    : fileName}{" "}
                </span>
                <FaTimes
                  className=" text-red-500 cursor-pointer"
                  onClick={() => {
                    setFileName("");
                    revert();
                  }}
                  size={"20px"}
                />
              </div>
            )}
          </div>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            ref={ref}
            onChange={onChange}
            className=" disabled:bg-gray-200 dark:bg-gray-800 dark:text-white text-gray-400 border-gray-200 dark:border-gray-500 appearance-none w-60 relative block px-3 py-2 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary  focus:z-10 text-sm"
            {...rest}
          />
        )}

        {error && (
          <p className="text-red-600 text-[10px] font-semibold ml-8">{error}</p>
        )}
      </div>
    );
  }
);

export default FormInput;
