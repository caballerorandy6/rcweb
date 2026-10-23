"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  /** Called whenever the dialog actually closes (Escape, backdrop, close()) */
  onClose: () => void;
  /** Ignore Escape and backdrop clicks, e.g. while a submission is pending */
  preventClose?: boolean;
  /** Element to focus on open; defaults to what the browser picks */
  initialFocus?: React.RefObject<HTMLElement | null>;
  /** Classes for the `<dialog>` itself: position, size and backdrop */
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children: React.ReactNode;
}

/**
 * Native `<dialog>` opened with showModal(): the browser traps focus, makes
 * the rest of the page inert, closes on Escape and returns focus to the
 * trigger. The page scroll lock lives in globals.css (body:has(dialog:modal)).
 */
export default function Modal({
  open,
  onClose,
  preventClose = false,
  initialFocus,
  className,
  id,
  children,
  ...aria
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      initialFocus?.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocus]);

  return (
    <dialog
      ref={ref}
      id={id}
      {...aria}
      className={className}
      onCancel={(event) => {
        if (preventClose) event.preventDefault();
      }}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the backdrop reach the dialog itself; the panel is a child
        if (event.target === event.currentTarget && !preventClose) {
          event.currentTarget.close();
        }
      }}
    >
      {children}
    </dialog>
  );
}
