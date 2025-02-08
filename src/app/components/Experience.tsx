"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRCWeb } from "@/context/rcWebContext";

//Components
import Heading from "@/app/components/Heading";

//npm packages
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

//Icons
import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface ExperienceProps {
  title: string;
  company: string;
  location: string;
  description: string;
  icon: React.ReactNode;
  date: string;
}

const experience: ExperienceProps[] = [
  {
    title: "Software Developer",
    company: "Atser Technologies, Inc.",
    location: "Houston, TX",
    description:
      "Frontend Development, Backend Development, User Experience, Visual Design",
    icon: <BriefcaseIcon />,
    date: "February 2025 - Present",
  },

  {
    title: "Freelance Web Developer",
    company: "Freelancer",
    location: "Houston, TX",
    description:
      "Frontend Development, Backend Development, User Experience, Visual Design",
    icon: <BriefcaseIcon />,
    date: "January 2022 - February 2025",
  },
  {
    title: "Bachelor of Software Engineering",
    company: "Universidad de Camaguey, Ignacio Agramonte Loynaz",
    location: "Camaguey, Cuba",
    description: "Software Engineering, Computer Science, Mathematics",
    icon: <AcademicCapIcon />,
    date: "September 2007 - July 2012",
  },
];

const Experience = () => {
  const { setActiveSection } = useRCWeb();

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Experience");
    }
  }, [inView, setActiveSection]);

  return (
    <section ref={ref} id="experience" className="py-16 mx-auto bg-gray-950">
      <Heading icon={<BriefcaseIcon className="w-8 text-gold" />}>
        Experience
      </Heading>
      <VerticalTimeline
        lineColor="#CBB26A"
        className="font-sans font-bold opacity-90"
      >
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
            <h3 className="text-lg font-medium sm:text-xl/8 font-sans">{`${item.title} | ${item.company}`}</h3>
            <p className="font-normal mt-0">{item.location}</p>
            <p className="!mt-1 !font-normal text-lg text-gray-400 sm:text-xl/8 font-sans">
              {item.description}
            </p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </section>
  );
};

export default Experience;
