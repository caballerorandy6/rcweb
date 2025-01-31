import { useContext } from "react";
import { RCWebContext } from "@/context/rcwebContext";

export const useRCWeb = () => {
  const rcWebContext = useContext(RCWebContext);
  if (!rcWebContext) {
    throw new Error("useRCWeb must be used within a RCWebProvider");
  }
  return rcWebContext;
};
