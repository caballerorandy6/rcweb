"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  /** Accessible name of the tab list ("Lead sources", "SMS campaigns") */
  label: string;
  tabs: TabItem[];
  /** Tab selected on first render; defaults to the first one */
  defaultTab?: string;
  /** Rendered before the tab list inside the header row (icon, title…) */
  heading?: ReactNode;
  /** Layout of the header row that holds the heading and the tab list */
  headerClassName?: string;
  listClassName?: string;
  /** "segmented": pills on a dark track; "underline": text with a gold bar */
  variant?: "segmented" | "underline";
}

const STYLES = {
  segmented: {
    list: "inline-flex gap-1 p-1 rounded-lg bg-gray-700/40",
    tab: "px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md font-inter transition-colors motion-reduce:transition-none",
    active: "bg-gold text-gray-900",
    inactive: "text-gray-300 hover:bg-gray-700/70 hover:text-white",
  },
  underline: {
    list: "flex gap-4 border-b border-gray-700",
    tab: "px-4 sm:px-6 py-3 font-semibold font-inter whitespace-nowrap border-b-2 -mb-px transition-colors motion-reduce:transition-none",
    active: "text-gold border-gold",
    inactive: "text-gray-400 border-transparent hover:text-gray-300",
  },
} as const;

/**
 * WAI-ARIA tabs: one tab stop in the list, arrow keys move between tabs and
 * select them, Home/End jump to the ends. Every panel stays mounted (hidden
 * with the HTML attribute) so server-rendered content is never fetched twice
 * and form state survives switching.
 */
export default function Tabs({
  label,
  tabs,
  defaultTab,
  heading,
  headerClassName,
  listClassName,
  variant = "segmented",
}: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const styles = STYLES[variant];

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div className={headerClassName}>
        {heading}
        <div
          role="tablist"
          aria-label={label}
          onKeyDown={handleKeyDown}
          className={`${styles.list} ${listClassName ?? ""}`}
        >
          {tabs.map((tab, index) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={tabId(tab.id)}
                aria-selected={selected}
                aria-controls={panelId(tab.id)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={`${styles.tab} ${selected ? styles.active : styles.inactive}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab.id)}
          aria-labelledby={tabId(tab.id)}
          tabIndex={0}
          hidden={tab.id !== active}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
