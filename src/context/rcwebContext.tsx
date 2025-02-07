"use client";

import React, { createContext, useState, ReactNode } from "react";
import { navigation } from "@/app/components/Navbar";

type SectionName = (typeof navigation)[number]["name"];

interface RCWebContextProps {
  children: ReactNode;
}

interface RCWebContextType {
  activeSection: SectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: (time: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleClickModal: () => void;
  isOpenProjetsDialog: boolean;
  setIsOpenProjetsDialog: (open: boolean) => void;
  handleClickProjetsDialog: () => void;
}

export const RCWebContext = createContext<RCWebContextType | null>(null);

export default function RCWebContextProvider({ children }: RCWebContextProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProjetsDialog, setIsOpenProjetsDialog] = useState(false);

  const handleClickModal = () => {
    setIsOpen(!isOpen);
  };

  const handleClickProjetsDialog = () => {
    setIsOpenProjetsDialog(!isOpenProjetsDialog);
  };

  return (
    <RCWebContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
        isOpen,
        setIsOpen,
        handleClickModal,
        isOpenProjetsDialog,
        setIsOpenProjetsDialog,
        handleClickProjetsDialog,
      }}
    >
      {children}
    </RCWebContext.Provider>
  );
}
