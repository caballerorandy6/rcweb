import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SectionKey } from "@/lib/navigation";

interface RCWebState {
  activeSection: SectionKey;
  setActiveSection: (section: SectionKey) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleClickModal: () => void;
  isOpenLetsContactDialog: boolean;
  setOpenLetsContactDialog: (open: boolean) => void;
}

export const useRCWebStore = create<RCWebState>()(
  persist(
    (set) => ({
      activeSection: "home",
      setActiveSection: (section) => set({ activeSection: section }),
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      handleClickModal: () => set((state) => ({ isOpen: !state.isOpen })),
      isOpenLetsContactDialog: false,
      setOpenLetsContactDialog: (open) =>
        set({ isOpenLetsContactDialog: open }),
    }),
    {
      // v2: section keys instead of English labels
      name: "rcweb-storage",
      version: 2,
      migrate: () => ({ activeSection: "home" as SectionKey }),
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
      // Only the highlighted nav item survives a reload; open/closed UI
      // state must not (a menu left open would reopen on the next visit).
      partialize: (state) => ({ activeSection: state.activeSection }),
    }
  )
);
