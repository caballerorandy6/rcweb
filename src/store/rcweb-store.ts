import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { navigation } from "@/lib/navigation";

type SectionName = (typeof navigation)[number]["name"];

interface RCWebState {
  activeSection: SectionName;
  setActiveSection: (section: SectionName) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleClickModal: () => void;
  isOpenLetsContactDialog: boolean;
  setOpenLetsContactDialog: (open: boolean) => void;
}

export const useRCWebStore = create<RCWebState>()(
  persist(
    (set) => ({
      activeSection: "Home",
      setActiveSection: (section) => set({ activeSection: section }),
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      handleClickModal: () => set((state) => ({ isOpen: !state.isOpen })),
      isOpenLetsContactDialog: false,
      setOpenLetsContactDialog: (open) =>
        set({ isOpenLetsContactDialog: open }),
    }),
    {
      name: "rcweb-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
      // Only the highlighted nav item survives a reload; open/closed UI
      // state must not (a menu left open would reopen on the next visit).
      partialize: (state) => ({ activeSection: state.activeSection }),
    }
  )
);
