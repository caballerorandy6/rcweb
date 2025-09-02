"use client";

import Heading from "@/app/components/Heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { experience } from "@/libs/data";
import useSectionObserver from "@/hooks/useSectionObserver";

export interface ExperienceProps {
  title: string;
  company: string;
  location: string;
  description: string;
  icon: React.ReactNode;
  date: string;
}

const Experience = () => {
  const ref = useSectionObserver({ sectionName: "Experience" });

  return (
    <section ref={ref} id="experience" className="mx-auto bg-gray-950">
      <Heading icon={<BriefcaseIcon className="w-8 text-gold" />}>
        Experience
      </Heading>
      <VerticalTimeline lineColor="#CBB26A" className="font-inter">
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
            contentArrowStyle={{
              borderRight: "20px solid #1F2937",
            }}
            date={item.date}
            icon={item.icon}
            iconStyle={{ background: "#CBB26A", color: "#1F2937" }}
          >
            <h3 className="text-xl sm:text-4xl font-iceland">{`${item.title} | ${item.company}`}</h3>
            <p className="font-inter text-base">{item.location}</p>
            <p className="mt-1 text-white/80 font-inter">{item.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </section>
  );
};

export default Experience;
