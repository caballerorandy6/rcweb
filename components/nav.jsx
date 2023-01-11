import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const linkVariants = {
  hover: {
    scale: 1.2,
  },
};

const Nav = () => {
  return (
    <nav className="w-full sm:flex text-slate-200">
      <motion.h1 className="text-slate-200 font-bold p-4 sm:p-8 cursor-pointer bg-none text-2xl sm:text-3xl md:text-4xl lg:text-5xl mx-auto sm:w-3/12 w-4/12 sm:text-start text-center">
        <Link href="/">RC Web</Link>
      </motion.h1>

      <div className="flex items-center justify-center mx-auto gap-4 sm:gap-8 font-bold uppercase text-xs sm:text-lg w-9/12 lg:text-lg">
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2 text"
        >
          <Link href="/" className=" hover:text-blue-300">
            Home
          </Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Link href="/about" className="hover:text-blue-300">
            About Me
          </Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Link href="/portfolio" className="hover:text-blue-300">
            Portfolio
          </Link>
        </motion.div>
        <motion.div
          variants={linkVariants}
          whileHover="hover"
          className="flex items-center gap-2"
        >
          <Link href="/contact" className="hover:text-blue-300">
            Contact
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;
