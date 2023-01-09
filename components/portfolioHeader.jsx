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

const PortfolioHeader = () => {
  return (
    <motion.div
      className="w-full"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      exit={"exit"}
    >
      <div className="flex flex-col ">
        <h1 className="text-white text-center text-3xl font-bold uppercase mb-2 pt-12">
          Portfolio
        </h1>
        <p className="text-opacity-50 text-white text-center text-md mb-4 uppercase">
          Check out some of my projects
        </p>
        <div className="w-16 content-none mx-auto h-2 bg-blue-300"></div>
      </div>
    </motion.div>
  );
};

export default PortfolioHeader;
