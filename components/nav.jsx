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
    <nav className="w-full sm:flex">
      <motion.h1
        initial={{ textShadow: "0px 0px 8px rgb(255, 255, 255)" }}
        variants={linkVariants}
        whileHover="hover"
        className="text-neutral-800 font-bold p-8 cursor-pointer bg-none sm:text-2xl md:text-3xl lg:text-4xl mx-auto sm:w-3/12 w-4/12 sm:text-start"
      >
        RC Web
      </motion.h1>

      <div className="flex items-center justify-center mx-auto gap-4 sm:gap-8 font-bold uppercase text-xs sm:text-sm md:text-md w-9/12 lg:text-lg">
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
          <Link href="/" className="text-white ">
            Home
          </Link>
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
          <Link href="/about" className="text-white ">
            About Me
          </Link>
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
          <Link href="/portfolio" className="text-white ">
            Portfolio
          </Link>
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
          <Link href="/contact" className="text-white ">
            Contact
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;
