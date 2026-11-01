"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRCWebStore } from "@/store/rcweb-store";
import type { SectionKey } from "@/lib/navigation";
import { withViewTransition } from "@/lib/viewTransition";

/**
 * One IntersectionObserver for the whole page: updates the URL hash, the
 * document title and the navbar's active item. Sections themselves stay
 * Server Components. Section ids double as navigation keys.
 */
export function useScrollSpy(sectionIds: SectionKey[]) {
  const setActiveSection = useRCWebStore((state) => state.setActiveSection);
  const t = useTranslations("Nav");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id") as SectionKey | null;
            if (id) {
              // Actualiza la URL sin recargar
              history.replaceState(null, "", `#${id}`);

              // Cambia dinámicamente el título
              const newTitle = t.has(id) ? `RC WEB | ${t(id)}` : "RC WEB";
              if (document.title !== newTitle) {
                document.title = newTitle;
              }

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
  }, [sectionIds, setActiveSection, t]);
}
