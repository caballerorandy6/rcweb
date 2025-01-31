"use client";

import { createContext, useState, ReactNode } from "react";

interface RCWebContextProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  timeOfLastClick: number;
  setTimeOfLastClick: (time: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeModal: () => void;
  openModal: () => void;
}

export const RCWebContext = createContext<RCWebContextProps | undefined>(
  undefined
);

export const RCWebProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <RCWebContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
        isOpen,
        setIsOpen,
        closeModal,
        openModal,
      }}
    >
      {children}
    </RCWebContext.Provider>
  );
};
