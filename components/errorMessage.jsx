import React from "react";

const ErrorMessage = ({ children }) => {
  return (
    <p className="font-bold w-full mt-2 text-red-500 text-sm">{children}</p>
  );
};

export default ErrorMessage;
