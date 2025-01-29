"use client";

import { useState, createContext, ReactNode } from "react";

interface RCWebContextProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  activeSection: string;
  setActiveSection: (value: string) => void;
  timeOfLastClick: number;
  setTimeOfLastClick: (value: number) => void;
}

export const RCWebContext = createContext<RCWebContextProps | undefined>(
  undefined
);

export const RCWebContextProvider = ({ children }: { children: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);

  return (
    <RCWebContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
      }}
    >
      {children}
    </RCWebContext.Provider>
  );
};

export default RCWebContextProvider;
