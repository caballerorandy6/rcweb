"use client";

import Image from "next/image";
import Heading from "@/app/components/Heading";
import Certifications from "@/app/components/Sections/Certifications";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion, Variants } from "framer-motion";

const About = () => {
  const ref = useSectionObserver({ sectionName: "About" });

  // Variantes para los párrafos
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
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <section ref={ref} id="about" className="mx-auto pt-24 sm:pt-32">
      <Heading
        icon={<UserPlusIcon className="w-8 text-gold" />}
        text="Who I Am and What I Do"
      >
        About Me
      </Heading>

      <div className="flex flex-col md:flex-row justify-center items-center gap-x-20 w-full mt-16 px-4 lg:px-0">
        <motion.div
          className="text-base font-inter max-w-2xl md:max-w-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            className="text-gray-100 leading-relaxed pb-10 text-justify md:text-left"
            variants={paragraphVariants}
          >
            React and Next.js Developer with over{" "}
            <strong className="text-gold font-semibold">
              5 years of experience
            </strong>{" "}
            building high-performance, scalable web applications. I have worked
            as a freelancer for diverse clients, delivering full-cycle solutions
            focused on{" "}
            <strong className="text-gold font-semibold">
              speed, resource optimization, accessibility, and outstanding user
              experience
            </strong>
            . My professional experience also includes roles at Atser Systems
            Inc. and Revature, where I contributed to{" "}
            <strong className="text-gold font-semibold">
              full-stack application development
            </strong>{" "}
            in collaborative Agile environments.
          </motion.p>

          <motion.p
            className="text-gray-100 leading-relaxed text-justify md:text-left"
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
            <span className="text-gold font-medium">digital marketing</span> and{" "}
            <span className="text-gold font-medium">WordPress</span>, allowing
            me to align technical execution with business strategy and user
            engagement goals.
          </motion.p>
        </motion.div>

        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariants}
        >
          <Image
            src="/about.avif"
            alt="About Image"
            width={500}
            height={500}
            className="image-gradient rounded-lg shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia mt-10 md:mt-0 mx-auto w-6/12 md:w-10/12 lg:w-8/12 animateProjectCard"
            priority={false}
          />
        </motion.figure>
      </div>
      <Certifications />
    </section>
  );
};

export default About;
