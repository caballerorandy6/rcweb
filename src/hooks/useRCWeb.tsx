import { useContext } from "react";
import { RCWebContext } from "@/context/rcWebContext";

export const useRCWeb = () => {
  const context = useContext(RCWebContext);
  if (context === null) {
    throw new Error("useRCWeb must be used within a RCWebProvider");
  }
  return context;
};
