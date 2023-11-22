import React from "react";

function Card({ title, IconComponent, color, subTitle }) {
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

  return (
    <div className="flex items-center bg-white dark:bg-gray-800  p-4 rounded-md">
      <div
        className={`flex items-center mr-5 justify-center w-14 h-14 rounded-full ${classes.background}`}
      >
        <IconComponent className={classes.text} size={"28px"} />
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
          {title}
        </p>
        <p className="text-2xl font-bold dark:text-gray-200">{subTitle}</p>
      </div>
    </div>
  );
}

export default Card;
