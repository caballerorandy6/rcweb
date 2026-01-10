"use client";

import Link from "next/link";
import { useRCWebStore } from "@/store/rcweb-store";
import Heading from "@/app/components/ui/Heading";
import {
  EnvelopeIcon,
  CalendarDaysIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import DialogForm from "@/app/components/forms/DialogForm";
import useSectionObserver from "@/hooks/useSectionObserver";

const Contact = () => {
  const { setOpenLetsContactDialog } = useRCWebStore();
  const ref = useSectionObserver({ sectionName: "Contact" });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<EnvelopeIcon className="w-8 text-gold" />}
          text="Get in Touch"
        >
          Contact
        </Heading>

        {/* Quick Contact Options */}
        <div className="mx-auto max-w-2xl mt-8 mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/schedule"
            className="relative inline-flex items-center justify-center gap-2 px-6 py-4 text-base sm:text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative flex items-center justify-center gap-2">
              <CalendarDaysIcon className="w-5 h-5" />
              Schedule Free Consultation
            </span>
          </Link>
          <a
            href="tel:+13463757534"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200"
          >
            <PhoneIcon className="w-5 h-5" />
            Call (346) 375-7534
          </a>
        </div>
        <p className="text-center text-white/70 mt-4 font-inter text-sm sm:text-base">
          Or send us a message below
        </p>
      </div>

        <div className="mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12 animateProjectCard">
          <DialogForm closeModal={() => setOpenLetsContactDialog(false)} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
