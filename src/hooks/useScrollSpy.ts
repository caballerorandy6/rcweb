"use client";

import { useEffect } from "react";
import { useRCWebStore } from "@/store/rcweb-store";
import type { SectionKey } from "@/lib/navigation";
import { withViewTransition } from "@/lib/viewTransition";

/**
 * One IntersectionObserver for the whole page: updates the URL hash and the
 * navbar's active item. The document title stays the one from the page metadata,
 * which is what search engines index, and the first section keeps a clean URL.
 * Sections themselves stay Server Components. Section ids double as navigation keys.
 */
export function useScrollSpy(sectionIds: SectionKey[]) {
  const setActiveSection = useRCWebStore((state) => state.setActiveSection);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id") as SectionKey | null;
            if (id) {
              const url = id === "home" ? location.pathname + location.search : `#${id}`;
              history.replaceState(null, "", url);

              withViewTransition(() => setActiveSection(id));
            }
            break;
          }
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px", // activa cuando la sección esté centrada
        threshold: 0,
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds, setActiveSection]);
}
