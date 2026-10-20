"use client";

import Marquee from "react-fast-marquee";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { teachMarqueeData } from "@/lib/data";

export interface TeachMarqueeProps {
  href: string;
  name: string;
  icon: React.ReactNode;
}

/**
 * The moving strip is decorative: the library clones its children to loop,
 * so the logos are hidden from assistive tech and a visually hidden list
 * carries the real links. The strip only runs while on screen and can be
 * paused by the visitor.
 */
const TechMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <div aria-hidden="true">
        <Marquee
          speed={100}
          gradient={false}
          pauseOnHover
          pauseOnClick
          play={inView && !paused}
        >
          <div className="flex items-center">
            {teachMarqueeData.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                className="flex items-center justify-center text-gray-100 hover:text-gold transition duration-200 ease-in-out hover:scale-105 mx-12"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </Marquee>
      </div>

      <ul className="sr-only" aria-label="Technologies I work with">
        {teachMarqueeData.map((item) => (
          <li key={item.name}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-inter text-white/60 hover:text-gold transition-colors"
        >
          {paused ? (
            <PlayIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PauseIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {paused ? "Play animation" : "Pause animation"}
        </button>
      </div>
    </div>
  );
};

export default TechMarquee;
