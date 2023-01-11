import React from "react";

const ErrorMessage = ({ children }) => {
  return (
    <p className="font-bold w-full mt-2 text-xs text-red-400 uppercase">
      {children}
    </p>
  );
};

export default ErrorMessage;
