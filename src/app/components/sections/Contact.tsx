"use client";

import Link from "next/link";
import { useRCWebStore } from "@/store/rcweb-store";
import Heading from "@/app/components/ui/Heading";
import { EnvelopeIcon, CalendarDaysIcon, PhoneIcon } from "@heroicons/react/24/outline";
import DialogForm from "@/app/components/forms/DialogForm";
import useSectionObserver from "@/hooks/useSectionObserver";

const Contact = () => {
  const { setOpenLetsContactDialog } = useRCWebStore();
  const ref = useSectionObserver({ sectionName: "Contact" });

  return (
    <section ref={ref} id="contact" className="py-32 mx-auto w-10/12">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-gray-900 font-semibold rounded-lg hover:bg-gold/90 transition-colors font-inter"
          >
            <CalendarDaysIcon className="w-5 h-5" />
            Schedule Free Consultation
          </Link>
          <a
            href="tel:+13463757534"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold/50 text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors font-inter"
          >
            <PhoneIcon className="w-5 h-5" />
            Call (346) 375-7534
          </a>
        </div>
        <p className="text-center text-white/60 mt-4 font-inter text-sm">
          Or send us a message below
        </p>
      </div>

      <div className="mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12 animateProjectCard">
        <DialogForm closeModal={() => setOpenLetsContactDialog(false)} />
      </div>
    </section>
  );
};

export default Contact;
