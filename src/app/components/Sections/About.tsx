"use client";

import Image from "next/image";
import Heading from "@/app/components/Heading";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion, Variants } from "framer-motion";

const About = () => {
  const ref = useSectionObserver({ sectionName: "About" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const paragraphVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.3 },
    },
  };

  return (
    <section ref={ref} id="about" className="pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<UserPlusIcon className="w-8 text-gold" />}
          text="Who I Am and What I Do"
        >
          About Me
        </Heading>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            className="text-base font-inter max-w-xl mx-auto lg:mx-0 lg:max-w-none w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              className="text-gray-100 leading-relaxed pb-10 text-justify lg:text-left"
              variants={paragraphVariants}
            >
              React and Next.js Developer with over{" "}
              <strong className="text-gold font-semibold">
                5 years of experience
              </strong>{" "}
              building high-performance, scalable web applications. I have
              worked as a freelancer for diverse clients, delivering full-cycle
              solutions focused on{" "}
              <strong className="text-gold font-semibold">
                speed, resource optimization, accessibility, and outstanding
                user experience
              </strong>
              . My professional experience also includes roles at Atser Systems
              Inc. and Revature, where I contributed to{" "}
              <strong className="text-gold font-semibold">
                full-stack application development
              </strong>{" "}
              in collaborative Agile environments.
            </motion.p>

            <motion.p
              className="text-gray-100 leading-relaxed text-justify lg:text-left"
              variants={paragraphVariants}
            >
              I specialize in{" "}
              <span className="text-gold font-medium">
                modern frontend development
              </span>{" "}
              using React and Next.js, and have hands-on experience{" "}
              <span className="text-gold font-medium">
                integrating RESTful APIs
              </span>
              , working with PostgreSQL databases, and managing state with tools
              like Zustand. Additionally, I bring valuable knowledge in{" "}
              <span className="text-gold font-medium">digital marketing</span>{" "}
              and <span className="text-gold font-medium">WordPress</span>,
              allowing me to align technical execution with business strategy
              and user engagement goals.
            </motion.p>
          </motion.div>

          <motion.figure
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
            className="flex justify-center lg:justify-end"
          >
            <Image
              src="/background.avif"
              alt="About Image"
              width={500}
              height={500}
              className="image-gradient rounded-lg shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia w-full max-w-md lg:max-w-full animateProjectCard"
              priority={false}
            />
          </motion.figure>
        </div>
      </div>
    </section>
  );
};

export default About;
