import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const linkVariants = {
  hover: {
    scale: 1.2,
    color: "#f8e112",
  },
};

const logoVariants = {
  hover: {
    scale: 1.1,
    color: "#f8e112",
  },
};

const Nav = () => {
  return (
    <nav className="w-full sm:flex">
      <motion.h1
        className="text-gray-200  p-8 cursor-pointer bg-none sm:text-3xl md:text-4xl lg:text-5xl mx-auto sm:w-3/12 w-4/12 sm:text-start"
        variants={logoVariants}
        whileHover="hover"
      >
        <Link href="/">RC Web</Link>
      </motion.h1>

      <div className="flex items-center justify-center mx-auto gap-4 sm:gap-8 font-bold uppercase text-xs sm:text-sm md:text-md w-9/12 lg:text-lg text-white">
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            className="hidden"
            src="/icons/home.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/">Home</Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            className="hidden"
            src="/icons/about.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/about">About Me</Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            className="hidden"
            src="/icons/portfolio.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/portfolio">Portfolio</Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Image
            className="hidden"
            src="/icons/Contact.png"
            width={20}
            height={20}
            alt="home image"
            priority
          />
          <Link href="/contact">Contact</Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;
