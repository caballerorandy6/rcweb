"use client";

import { useId } from "react";
import { useRCWebStore } from "@/store/rcweb-store";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/Heading";
import CertificationsList from "./CertificationsList";
import { certifications } from "@/libs/arrays";

const Certifications = () => {
  const { isExpanded, handleClickCertificationsDialog } = useRCWebStore();
  const contentId = useId();

  const initialVisibleCertifications = 3;
  const visibleCertifications = isExpanded
    ? certifications.length
    : initialVisibleCertifications;

  return (
    <section id="certifications" className=" mt-20 w-10/12 mx-auto">
      <Heading icon={<CheckCircleIcon className="w-8 text-gold" />}>
        Certifications
      </Heading>

      <CertificationsList
        certifications={certifications.slice(0, visibleCertifications)}
      />

      {certifications.length > initialVisibleCertifications && (
        <div className="flex justify-center mt-12 mb-10">
          <button
            type="button"
            className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            onClick={handleClickCertificationsDialog}
            aria-expanded={isExpanded}
            aria-controls={contentId}
          >
            {isExpanded ? "Show Less" : "All Certifications"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Certifications;
