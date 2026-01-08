import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRCWebStore } from "@/store/rcweb-store";
interface UseSectionObserverProps {
  sectionName: string;
}

export default function useSectionObserver({
  sectionName,
}: UseSectionObserverProps) {
  const { setActiveSection } = useRCWebStore();

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "-10% 0px -10% 0px", // More permissive detection
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(sectionName);
    }
  }, [inView, sectionName, setActiveSection]);

  return ref;
}
