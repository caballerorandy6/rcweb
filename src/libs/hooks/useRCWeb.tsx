import { useContext } from "react";
import { RCWebContext } from "@/context/RCWebContext";

const useRCWeb = () => {
  const contextRCWeb = useContext(RCWebContext);

  return contextRCWeb;
};

export default useRCWeb;
