"use client";

import { motion } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

interface TermsNoticeModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const TermsNoticeModal = ({
  onConfirm,
  onCancel,
}: TermsNoticeModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gray-900/95 rounded-2xl p-8 max-w-md w-full border border-gold/20 shadow-2xl shadow-gold/10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <ShieldCheckIcon className="w-12 h-12 text-gold" />
          <h3 className="text-4xl font-iceland text-gold font-bold">
            Before you continue
          </h3>
          <p className="text-white/80 font-inter text-sm">
            To proceed with the payment, you must scroll and read our{" "}
            <span className="text-gold font-semibold">Terms of Service</span>{" "}
            and accept them at the end.
          </p>

          <div className="flex gap-4 mt-6 font-inter">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-gold text-gray-900 rounded-lg font-bold hover:bg-gold/90 transition-all"
            >
              I Understand
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
