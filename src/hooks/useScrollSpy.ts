"use client";

import { useEffect } from "react";

const sectionTitle: Record<string, string> = {
  home: "RC WEB | Home",
  experience: "RC WEB | Experience",
  projects: "RC WEB | Projects",
  about: "RC WEB | About",
  contact: "RC WEB | Contact",
};

export function useScrollSpy(sectionIds: string[]) {
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
  }, [sectionIds]);
}
