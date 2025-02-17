import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { navigation } from "@/app/components/Navbar";

type SectionName = (typeof navigation)[number]["name"];

interface RCWebState {
  activeSection: SectionName;
  setActiveSection: (section: SectionName) => void;
  timeOfLastClick: number;
  setTimeOfLastClick: (time: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleClickModal: () => void;
  isOpenProjetsDialog: boolean;
  setIsOpenProjetsDialog: (open: boolean) => void;
  handleClickProjetsDialog: () => void;
}

export const useRCWebStore = create<RCWebState>()(
  persist(
    (set) => ({
      activeSection: "Home",
      setActiveSection: (section) => set({ activeSection: section }),
      timeOfLastClick: 0,
      setTimeOfLastClick: (time) => set({ timeOfLastClick: time }),
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      handleClickModal: () => set((state) => ({ isOpen: !state.isOpen })),
      isOpenProjetsDialog: false,
      setIsOpenProjetsDialog: (open) => set({ isOpenProjetsDialog: open }),
      handleClickProjetsDialog: () =>
        set((state) => ({ isOpenProjetsDialog: !state.isOpenProjetsDialog })),
    }),
    {
      name: "rcweb-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
