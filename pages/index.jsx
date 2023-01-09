import Layout from "../components/layout";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TypewriterReact from "../components/typewriter";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,

    transition: {
      duration: 1,
    },
  },
  exit: {
    x: "100vw",
    transition: {
      ease: "easeInOut",
      duration: 0.5,
    },
  },
};

function Index() {
  return (
    <Layout
      title={"Home"}
      description={"RC - Web, Randy Caballero, Portfolio, Home"}
    >
      <motion.div
        className="flex flex-col items-center justify-center h-screen w-screen text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <p className="text-white text-opacity-40 lg:text-7xl md:text-5xl sm:text-3xl text-2xl">
          {"Hello, I'm Randy Caballero"}
        </p>

        <TypewriterReact />

        <div className="flex flex-col">
          <label className="text-slate-400 text-center font-semibold uppercase text-sm mt-10">
            Download my resume
          </label>
          <Link
            target="_blank"
            href="/public/Randy-Caballero.pdf"
            download="Randy-Caballero.pdf"
            className="text-center p-2"
          >
            <Image
              src="/img/download.png"
              width={25}
              height={25}
              alt="download image"
              priority
            />
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
}

export default Index;
