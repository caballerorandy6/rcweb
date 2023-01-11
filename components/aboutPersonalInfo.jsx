import Image from "next/legacy/image";
import { motion } from "framer-motion";

const firstContentVariants = {
  hidden: {
    x: "100vw",
  },
  visible: {
    x: 0,
    transition: { type: "spring", mass: 1.2, damping: 10, delay: 0.5 },
  },
  exit: {
    x: "100vw",
    transition: { type: "spring", mass: 1.2, damping: 10, delay: 0.5 },
  },
};

const AboutPersonalInfo = () => {
  return (
    <motion.div
      className="flex flex-col w-11/12 sm:w-8/12 mx-auto items-center sm:ml-16 mt-10 sm:mt-20"
      variants={firstContentVariants}
      initial="hidden"
      animate="visible"
      exit={"exit"}
    >
      <h2 className="text-slate-200 text-xl font-bold p-2 sm:place-self-start">
        Randy Caballero
      </h2>
      <div className="flex sm:place-self-start">
        <Image
          src="/icons/about-icons/location.png"
          width={20}
          height={20}
          alt="location image"
          priority
        />
        <p className="text-opacity-50 text-white text-sm ml-1">
          United States, America
        </p>
      </div>
      <p className="w-10/12 text-center sm:text-start text-opacity-50 text-white p-2 sm:place-self-start">
        Hello, my name is Randy Caballero and I am a Web Developer. I am a
        professional committed to my profession and a lover of technology,
        specifically programming. My passion for the study and research of new
        technologies, enhance my growth and feed my range of new skills.
      </p>

      <div className="hidden lg:flex gap-28 mt-14 sm:place-self-start">
        <div className="flex gap-2">
          <Image
            className="w-auto h-auto"
            src="/icons/about-icons/briefcase.png"
            width={50}
            height={50}
            alt="coffee image"
            priority
          />
          <div>
            <p className="text-slate-200 font-bold">1 Year Experience</p>
            <p className="text-opacity-50 text-white text-sm">Experience</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Image
            src="/icons/about-icons/projects.png"
            width={50}
            height={50}
            alt="coffee image"
            priority
          />
          <div>
            <p className="text-slate-200 font-bold">10+ Projects</p>
            <p className="text-opacity-50 text-white text-sm">Completed</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Image
            src="/icons/about-icons/coffee.png"
            width={50}
            height={50}
            alt="coffee image"
            priority
          />
          <div>
            <p className="text-slate-200 font-bold">50+ Meetings</p>
            <p className="text-opacity-50 text-white text-sm">Successful</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPersonalInfo;
