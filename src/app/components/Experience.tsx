"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

//Zustand Store
import { useRCWebStore } from "@/store/rcweb-store";

//Components
import Heading from "@/app/components/Heading";

//npm packages
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

//Icons
import { BriefcaseIcon } from "@heroicons/react/24/outline";

//Data
import { experience } from "@/libs/arrays";

export interface ExperienceProps {
  title: string;
  company: string;
  location: string;
  description: string;
  icon: React.ReactNode;
  date: string;
}

const Experience = () => {
  const { setActiveSection } = useRCWebStore();

  const { ref, inView } = useInView({
    threshold: 0.25,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Experience");
    }
  }, [inView, setActiveSection]);

  return (
    <section ref={ref} id="experience" className="mx-auto bg-gray-950">
      <Heading icon={<BriefcaseIcon className="w-8 text-gold" />}>
        Experience
      </Heading>
      <VerticalTimeline lineColor="#CBB26A" className="font-mono">
        {experience.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            contentStyle={{
              background: "#1F2937",
              color: "#CBB26A",
              border: "1px, solid, rgba(0, 0, 0, 0.05)",
              boxShadow: "none",
              textAlign: "left",
              padding: "1.3rem 2rem",
            }}
            contentArrowStyle={{ borderRight: "20px solid #1F2937" }}
            date={item.date}
            icon={item.icon}
            iconStyle={{ background: "#CBB26A", color: "#1F2937" }}
          >
            <h3 className="font-medium sm:text-xl font-sans">{`${item.title} | ${item.company}`}</h3>
            <p className="font-mono">{item.location}</p>
            <p className="mt-1 text-white/80 sm:text-xl font-mono">
              {item.description}
            </p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </section>
  );
};

export default Experience;
