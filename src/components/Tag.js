import React from "react";

function Tag({ text, color, small }) {
  const getClassesForColor = (color) => {
    switch (color) {
      case "blue":
        return {
          background: "bg-blue-200",
          text: "text-blue-700",
        };
      case "yellow":
        return {
          background: "bg-yellow-200",
          text: "text-yellow-700",
        };
      case "red":
        return {
          background: "bg-red-200",
          text: "text-red-700",
        };
      case "green":
        return {
          background: "bg-green-200",
          text: "text-green-700",
        };
      case "indigo":
        return {
          background: "bg-indigo-200",
          text: "text-indigo-700",
        };
      default:
        return {
          background: "bg-gray-200",
          text: "text-gray-700",
        };
    }
  };

  const classes = getClassesForColor(color);
  let baseClass = "";
  if (small) {
    baseClass = "text-xs  py-1 px-3 w-22 ";
  } else {
    baseClass = "text-sm  py-2 px-5 ";
  }
  return (
    <div
      className={`  ${classes.background} ${classes.text}   uppercase select-none flex items-center justify-center font-semibold  ${baseClass} rounded-3xl `}
    >
      {text}
    </div>
  );
}

export default Tag;
