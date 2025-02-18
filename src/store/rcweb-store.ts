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
  isOpenProjectsDialog: boolean;
  setIsOpenProjectsDialog: (open: boolean) => void;
  handleClickProjectsDialog: () => void;
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
      isOpenProjectsDialog: false,
      setIsOpenProjectsDialog: (open) => set({ isOpenProjectsDialog: open }),
      handleClickProjectsDialog: () =>
        set((state) => ({ isOpenProjectsDialog: !state.isOpenProjectsDialog })),
    }),
    {
      name: "rcweb-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
    }
  )
);
