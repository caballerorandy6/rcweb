"use client";

import { useEffect } from "react";

import Image from "next/image";
import Heading from "@/app/components/Heading";
import { useInView } from "react-intersection-observer";
import { useRCWebStore } from "@/store/rcweb-store";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import TechMarquee from "./TechMarquee";

const About = () => {
  const { setActiveSection } = useRCWebStore();

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("About");
    }
  }, [inView, setActiveSection]);

  return (
    <section ref={ref} id="about" className="mx-auto w-10/12">
      <Heading icon={<UserPlusIcon className="w-8 text-gold" />}>
        About Me
      </Heading>
      <div className="flex flex-col md:flex-row justify-center items-center gap-x-20 w-full">
        <div className="font-mono text-base text-gray-100">
          <span className="pb-10">
            My name is Randy Caballero. I graduated with a degree in{" "}
            <span className="text-gold">Software Engineering</span> from the
            University of Camagüey &quot;Ignacio Agramonte y Loynaz.&quot; I
            also completed a{" "}
            <span className="text-gold">Master&apos;s degree in Education</span>{" "}
            and am currently pursuing my{" "}
            <span className="text-gold">Ph.D. in Education</span> at Nova
            Southeastern University. At present, I am working as a{" "}
            <span className="text-gold">Software Developer</span> at Atser
            Systems Inc.
          </span>
          <br />
          <br />
          <span>
            I also work as a{" "}
            <span className="text-gold">freelance developer</span>, providing
            customized solutions and ongoing support to my clients to help them
            achieve their technology goals. I collaborate closely with clients
            to understand their unique requirements,{" "}
            <span className="text-gold">
              ensuring that each solution is customized and scalable
            </span>{" "}
            to meet their evolving business needs.
          </span>
        </div>

        <Image
          src="/about.webp"
          alt="About Image"
          width={185}
          height={200}
          className="image-gradient rounded-lg shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia mt-10 md:mt-0 mx-auto w-4/12 md:w-3/12 lg:w-2/12 animateProjectCard"
        />
      </div>
      <div className="w-full mx-auto mt-6">
        <TechMarquee />
      </div>
    </section>
  );
};

export default About;
