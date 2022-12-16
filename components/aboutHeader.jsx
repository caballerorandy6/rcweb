import { motion } from "framer-motion";

const headerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.8 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const AboutHeader = () => {
  return (
    <motion.div
      className="overflow-y-scroll"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      exit={"exit"}
    >
      <h1 className="text-white text-center text-3xl font-bold uppercase mb-2 mt-10">
        About Me
      </h1>
      <p className="text-opacity-50 text-white text-center text-md mb-4 uppercase">
        Relevant personal information
      </p>
      <div className="w-16 content-none mx-auto h-2 bg-blue-300"></div>
    </motion.div>
  );
};

export default AboutHeader;
