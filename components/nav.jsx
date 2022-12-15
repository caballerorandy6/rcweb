import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const linkVariants = {
  hover: {
    scale: 1.2,
    textShadow: "0px 0px 8px rgb(255, 255, 255)",
  },
};

const Nav = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-around">
      <motion.h1
        variants={linkVariants}
        whileHover="hover"
        className="text-5xl text-white font-bold p-8 cursor-pointer"
      >
        RC-Web
      </motion.h1>

      <div className="flex items-center gap-8 font-bold uppercase">
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            src="/icons/home.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/" className="text-white text-md">
            Home
          </Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            src="/icons/about.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/about" className="text-white text-md">
            About Me
          </Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            src="/icons/portfolio.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/portfolio" className="text-white text-md">
            Portfolio
          </Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            src="/icons/Contact.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/contact" className="text-white text-md">
            Contact
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;
