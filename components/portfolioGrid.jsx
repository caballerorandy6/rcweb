import Link from "next/link";
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

const PortfolioGrid = () => {
  return (
    <motion.main
      className="grid sm:grid-cols-1 md:grid-cols-2 md:w-11/12 lg:grid-cols-3 lg:w-10/12 w-10/12  mx-auto my-20 gap-4"
      variants={secondVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Link
        href="https://weatherapp1988.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/weatherApp.png"
            alt="Weader App Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Weather App
            </p>
            <p className="item-text-title text-2xl">React, TailwindCSS, Vite</p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://musical-instruments-store.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/music-store.png"
            alt="Musical Instrument Store Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Musical Instrument Store
            </p>
            <p className="item-text-title text-2xl">
              React, TailwindCSS, Vite, Strapi, PostgreSQL
            </p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://seachdrinks.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/searchDrinks.png"
            alt="Search Drinks Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Search Drinks
            </p>
            <p className="item-text-title text-2xl">
              React, React Bootstrap, Vite
            </p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://insurancequotes6.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/insuranceQuotes.png"
            alt="Insurance Quotes Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Insurance Quotes
            </p>
            <p className="item-text-title text-2xl">React, TailwindCSS, Vite</p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://react-crm7.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/crmReact.png"
            alt="CRM React Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              CRM React
            </p>
            <p className="item-text-title text-2xl">
              React, React Router Dom, TailwindCSS, Vite
            </p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://crypto-quotation.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/crypto.png"
            alt="Crypto Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Cryptocurrency Quotation System
            </p>
            <p className="item-text-title text-2xl">React, TailwindCSS, Vite</p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://cost-planner.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/monthlyExpensesPlanner.png"
            alt="Monthly Espenses Planner Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Monthly Espenses Planner
            </p>
            <p className="item-text-title text-2xl">React, TailwindCSS, Vite</p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://mini-library1.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/minilibrary.png"
            alt="Mini Library Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Mini Library
            </p>
            <p className="item-text-title text-2xl">React, TailwindCSS, Vite</p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
      <Link
        href="https://weatherapp1988.netlify.app/"
        target="_blank"
        className="item"
      >
        <div className="relative item-image">
          <Image
            src="/grid/weatherApp.png"
            alt="Weader App Image"
            priority
            layout="fill"
            objectFit="fill"
          />
        </div>
        <div className="item-text">
          <div className="item-text-wrap">
            <p className="item-text-category text-4xl font-bold p-1">
              Weather App
            </p>
            <p className="item-text-title text-2xl">React, TailwindCSS, Vite</p>
            <p className="font-bold">View More...</p>
          </div>
        </div>
      </Link>
    </motion.main>
  );
};

export default PortfolioGrid;
