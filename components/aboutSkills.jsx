import Image from "next/legacy/image";
import { motion } from "framer-motion";

const secondVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeIn",
      delay: 0.5,
      duration: 1.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeOut",
      delay: 0.3,
      duration: 0.3,
    },
  },
};

const AboutSkills = () => {
  return (
    <motion.div
      className="w-11/12 mt-20 bg-neutral-900 p-10 shadow-md mx-auto mb-8 bg-opacity-70"
      variants={secondVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className=" text-center">
        <h1 className="text-3xl text-white mb-4">My Skills</h1>
        <div className="w-16 content-none mx-auto h-2 bg-blue-300"></div>
        <div className="hidden md:flex gap-4 justify-center mt-10">
          <Image
            src="/skills/html.png"
            width={50}
            height={50}
            alt="html image"
            priority
          />
          <Image
            src="/skills/css.png"
            width={50}
            height={50}
            alt="css image"
            priority
          />
          <Image
            src="/skills/sass.png"
            width={50}
            height={50}
            alt="sass image"
            priority
          />
          <Image
            src="/skills/tailwind.png"
            width={50}
            height={50}
            alt="tailwind image"
            priority
          />
          <Image
            src="/skills/javascript.png"
            width={50}
            height={50}
            alt="javascript image"
            priority
          />
          <Image
            src="/skills/react.png"
            width={50}
            height={50}
            alt="react image"
            priority
          />
          <Image
            src="/skills/sql.png"
            width={50}
            height={50}
            alt="sql image"
            priority
          />
          <Image
            src="/skills/mysql.png"
            width={50}
            height={50}
            alt="mysql image"
            priority
          />
          <Image
            src="/skills/postgre.png"
            width={50}
            height={50}
            alt="postgre image"
            priority
          />
          <Image
            src="/skills/mongo.png"
            width={50}
            height={50}
            alt="mongo image"
            priority
          />
          <Image
            src="/skills/html.png"
            width={50}
            height={50}
            alt="html image"
            priority
          />
          <Image
            src="/skills/java.png"
            width={50}
            height={50}
            alt="java image"
            priority
          />
          <Image
            src="/skills/docker.png"
            width={50}
            height={50}
            alt="docker image"
            priority
          />
          <Image
            src="/skills/aws.png"
            width={50}
            height={50}
            alt="aws image"
            priority
          />
          <Image
            src="/skills/git.png"
            width={50}
            height={50}
            alt="aws image"
            priority
          />
        </div>
        <ul className="flex md:hidden items-center justify-center font-semibold gap-6 mt-6 gold">
          <div>
            <li>HTML</li>
            <li>CSS</li>
            <li>Sass</li>
            <li>TailwindCSS</li>
          </div>
          <div>
            <li>Javascript</li>
            <li>Java</li>
            <li>ReactJS</li>
            <li>Git</li>
          </div>
          <div>
            <li>Docker</li>
            <li>MySQL</li>
            <li>PostgreSQL</li>
            <li>Mongo DB</li>
          </div>
        </ul>
      </div>
      <div className="mt-10 sm:mt-20">
        <p className="text-3xl text-white text-center">My Services</p>
        <div className="sm:flex gap-6">
          <div className="flex items-center gap-6 mt-10">
            <div>
              <h1 className="text-opacity-80 text-white text-lg font-bold">
                Web Development
              </h1>
              <p className="text-opacity-50 text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                ullamcorper tortor ac neque placerat, vel vestibulum ligula
                suscipit. Donec pharetra sollicitudin ultrices.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-10">
            <div>
              <h1 className="text-opacity-80 text-white text-lg font-bold">
                Web Design
              </h1>
              <p className="text-opacity-50 text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                ullamcorper tortor ac neque placerat, vel vestibulum ligula
                suscipit. Donec pharetra sollicitudin ultrices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutSkills;
