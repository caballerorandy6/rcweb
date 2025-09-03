"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { useRCWebStore } from "@/store/rcweb-store";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/Heading";
import CertificationsList from "@/app/components/CertificationsList";
import { certifications } from "@/libs/data";

const Certifications = () => {
  const { isExpanded, handleClickCertificationsDialog } = useRCWebStore();
  const contentId = useId();

  const initialVisibleCertifications = 3;
  const visibleCertifications = isExpanded
    ? certifications.length
    : initialVisibleCertifications;

  return (
    <section
      id="certifications"
      className="pt-24 sm:pt-32 mt-20 w-10/12 mx-auto"
    >
      <Heading
        icon={<CheckCircleIcon className="w-8 text-gold" />}
        text="Learn and grow is my priority"
      >
        Degrees & Certifications
      </Heading>

      {/* Certifications with smooth height animation */}
      <motion.div
        className="relative"
        initial={false}
        animate={{
          height: "auto",
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <CertificationsList
          certifications={certifications.slice(0, visibleCertifications)}
        />
      </motion.div>

      {certifications.length > initialVisibleCertifications && (
        <motion.div
          className="flex justify-center mt-12 mb-10"
          layout
          transition={{
            layout: { duration: 0.3 },
            ease: "easeInOut",
          }}
        >
          <motion.button
            type="button"
            className="group text-sm/6 font-inter text-white/80 hover:bg-gold/20 px-6 py-2.5 rounded-lg flex items-center gap-x-2 border border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            onClick={handleClickCertificationsDialog}
            aria-expanded={isExpanded}
            aria-controls={contentId}
            whileTap={{ scale: 0.95 }}
          >
            <span>
              {isExpanded
                ? "Show Less"
                : `View All ${certifications.length} Certifications`}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDownIcon className="w-4 h-4 text-gold" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </section>
  );
};

export default Certifications;
