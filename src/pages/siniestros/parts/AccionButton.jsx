import React from "react";

const AccionButton = ({ onClick, children, disabled, className, ...props }) => {
  return (
    <button
      type={"button"}
      className={`btn-document-action btn m-0 p-0 ${className} border-0`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default AccionButton;
