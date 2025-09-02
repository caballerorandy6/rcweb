"use client";

import Image from "next/image";
import Heading from "@/app/components/Heading";
import Certifications from "@/app/components/Certifications";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";

const About = () => {
  const ref = useSectionObserver({ sectionName: "About" });

  return (
    <section ref={ref} id="about" className="mx-auto w-10/12">
      <Heading icon={<UserPlusIcon className="w-8 text-gold" />}>
        About Me
      </Heading>
      <div className="flex flex-col md:flex-row justify-center items-center gap-x-20 w-full">
        <div className="text-base text-gray-100 font-inter">
          <p className="pb-10">
            React and Next.js Developer with over{" "}
            <strong className="text-gold">3 years of experience</strong>{" "}
            building high-performance, scalable web applications. I have worked
            as a freelancer for diverse clients, delivering full-cycle solutions
            focused on{" "}
            <strong className="text-gold">
              speed, resource optimization, accessibility, and outstanding user
              experience
            </strong>
            . My professional experience also includes roles at Atser Systems
            Inc. and Revature, where I contributed to{" "}
            <strong className="text-gold">
              full-stack application development
            </strong>{" "}
            in collaborative Agile environments.
          </p>
          <p>
            I specialize in{" "}
            <span className="text-gold">modern frontend development</span> using
            React and Next.js, and have hands-on experience{" "}
            <span className="text-gold">integrating RESTful APIs</span>, working
            with PostgreSQL databases, and managing state with tools like
            Zustand. Additionally, I bring valuable knowledge in{" "}
            <span className="text-gold">digital marketing</span> and{" "}
            <span className="text-gold">WordPress</span>, allowing me to align
            technical execution with business strategy and user engagement
            goals.
          </p>
        </div>

        <figure>
          <Image
            src="/about.avif"
            alt="About Image"
            width={500}
            height={500}
            className="image-gradient rounded-lg shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia mt-10 md:mt-0 mx-auto w-6/12 md:w-10/12 lg:w-8/12 animateProjectCard"
            priority={false}
          />
        </figure>
      </div>
      <Certifications />
    </section>
  );
};

export default About;
