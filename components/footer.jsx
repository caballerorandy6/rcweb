import Link from "next/link";
import Image from "next/legacy/image";
import Nav from "./nav";
import { motion } from "framer-motion";

const linkVariants = {
  hover: {
    scale: 1.2,
    textShadow: "0px 0px 8px rgb(255, 255, 255)",
  },
};

const shadowVariants = {
  shadow: {
    textShadow: "0px 0px 5px rgb(220, 220, 0)",
  },
};

function Footer() {
  return (
    <footer className="flex align-bottom justify-evenly items-center h-32 bg-black opacity-95">
      <nav className="flex items-center relative gap-4">
        <motion.div variants={linkVariants} whileHover="hover">
          <Link href="https://github.com/caballerorandy6" target="_blank">
            <Image
              src="/social/github.png"
              width={25}
              height={25}
              alt="github image"
              priority
            />
          </Link>
        </motion.div>

        <motion.div variants={linkVariants} whileHover="hover">
          <Link href="https://linkedin.com/in/caballerorandy" target="_blank">
            <Image
              src="/social/linkedin.png"
              width={25}
              height={25}
              alt="github image"
              priority
            />
          </Link>
        </motion.div>

        <motion.div variants={linkVariants} whileHover="hover">
          <Link href="https://twitter.com/caballerorandy6" target="_blank">
            <Image
              src="/social/twitter.png"
              width={25}
              height={25}
              alt="github image"
              priority
            />
          </Link>
        </motion.div>
      </nav>
      <motion.p
        variants={shadowVariants}
        initial="shadow"
        className=" text-white  text-center text-xs font-semibold "
      >
        {`© ${new Date().getFullYear()}  All rights reserved.`}
      </motion.p>
    </footer>
  );
}

export default Footer;
