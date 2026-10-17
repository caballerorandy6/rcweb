import { flushSync } from "react-dom";

/**
 * Runs a state update inside a View Transition so elements with a
 * `view-transition-name` (the navbar's active pill) animate between the
 * old and new layout. Falls back to a plain update without browser support
 * or when the visitor prefers reduced motion.
 */
export function withViewTransition(update: () => void) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}
