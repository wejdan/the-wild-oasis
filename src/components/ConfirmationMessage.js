import React from "react";
import Button from "./Button";

function ConfirmationMessage({ children }) {
  return <div className="dark:text-white">{children}</div>;
}

function Content({ children }) {
  return <p className="font-bold text-gray-500 dark:text-white">{children}</p>;
}

function Actions({ handleYes, isLoading, handleCancel }) {
  return (
    <div className="flex justify-end gap-2 mt-5">
      <Button loading={isLoading} disabled={isLoading} onClick={handleYes}>
        Yes
      </Button>
      <Button outline={true} disabled={isLoading} onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
}

ConfirmationMessage.Content = Content;
ConfirmationMessage.Actions = Actions;

export default ConfirmationMessage;
