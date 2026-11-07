import { flushSync } from "react-dom";

/**
 * Runs a state update inside a View Transition so elements with a
 * `view-transition-name` (the navbar's active pill) animate between the
 * old and new layout. Falls back to a plain update without browser support
 * or when the visitor prefers reduced motion, and in a hidden tab, where the
 * browser would skip the transition anyway.
 */
export function withViewTransition(update: () => void) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    document.visibilityState === "hidden" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  const transition = document.startViewTransition(() => flushSync(update));
  // The browser skips the animation when a newer transition starts or the
  // tab is hidden. The update still runs, so a rejected `ready` is not an error.
  transition.ready.catch(() => {});
}
