"use client";

import { useEffect } from "react";
import { useRCWebStore } from "@/store/rcweb-store";
import { navigation } from "@/lib/navigation";
import { withViewTransition } from "@/lib/viewTransition";

type SectionName = (typeof navigation)[number]["name"];

const sectionTitle: Record<string, string> = {
  home: "RC WEB | Home",
  services: "RC WEB | Services",
  projects: "RC WEB | Projects",
  process: "RC WEB | Process",
  experience: "RC WEB | Experience",
  testimonials: "RC WEB | Testimonials",
  about: "RC WEB | About",
  certifications: "RC WEB | Certifications",
  pricing: "RC WEB | Pricing",
  faq: "RC WEB | FAQ",
  contact: "RC WEB | Contact",
  cta: "RC WEB | CTA",
};

// Section id → navigation item it highlights in the navbar
const sectionNavName: Record<string, SectionName> = Object.fromEntries(
  navigation.map((item) => [item.hash.replace(/^\/?#?/, ""), item.name])
) as Record<string, SectionName>;

/**
 * One IntersectionObserver for the whole page: updates the URL hash, the
 * document title and the navbar's active item. Sections themselves stay
 * Server Components.
 */
export function useScrollSpy(sectionIds: string[]) {
  const setActiveSection = useRCWebStore((state) => state.setActiveSection);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              // Actualiza la URL sin recargar
              history.replaceState(null, "", `#${id}`);

              // Cambia dinámicamente el título
              const newTitle = sectionTitle[id] || "RC WEB";
              if (document.title !== newTitle) {
                document.title = newTitle;
              }

              const navName = sectionNavName[id];
              if (navName) withViewTransition(() => setActiveSection(navName));
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
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el!));

    return () => observer.disconnect();
  }, [sectionIds, setActiveSection]);
}
