import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { navigation } from "@/lib/data";

type SectionName = (typeof navigation)[number]["name"];

interface RCWebState {
  activeSection: SectionName;
  setActiveSection: (section: SectionName) => void;
  timeOfLastClick: number;
  setTimeOfLastClick: (time: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleClickModal: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  handleClickProjectsDialog: () => void;
  isOpenLetsContactDialog: boolean;
  setOpenLetsContactDialog: (open: boolean) => void;
  handleClickLetsContactDialog: () => void;
  isOpenCertificationsDialog: boolean;
  setOpenCertificationsDialog: (open: boolean) => void;
  handleClickCertificationsDialog: () => void;
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
      isExpanded: false,
      setIsExpanded: (expanded) => set({ isExpanded: expanded }),
      handleClickProjectsDialog: () =>
        set((state) => ({ isExpanded: !state.isExpanded })),
      isOpenLetsContactDialog: false,
      setOpenLetsContactDialog: (open) =>
        set({ isOpenLetsContactDialog: open }),
      handleClickLetsContactDialog: () =>
        set((state) => ({
          isOpenLetsContactDialog: !state.isOpenLetsContactDialog,
        })),
      isOpenCertificationsDialog: false,
      setOpenCertificationsDialog: (open) =>
        set({ isOpenCertificationsDialog: open }),
      handleClickCertificationsDialog: () =>
        set((state) => ({
          isExpanded: !state.isExpanded,
        })),
    }),
    {
      name: "rcweb-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
    }
  )
);
