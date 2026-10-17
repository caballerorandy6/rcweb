import { create } from "zustand";

interface CheckoutState {
  /** Plan whose checkout modal is open; null when closed */
  planId: string | null;
  open: (planId: string) => void;
  close: () => void;
}

/** Links the pricing cards (server-rendered) to the checkout modal island */
export const useCheckoutStore = create<CheckoutState>()((set) => ({
  planId: null,
  open: (planId) => set({ planId }),
  close: () => set({ planId: null }),
}));
