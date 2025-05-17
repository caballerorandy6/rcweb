"use client";

import { useRCWebStore } from "@/store/rcweb-store";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Heading from "@/app/components/Heading";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import DialogForm from "@/app/components/DialogForm";

const Contact = () => {
  const { setActiveSection, setOpenLetsContactDialog } = useRCWebStore();

  const { ref, inView } = useInView({
    threshold: 0.25,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Contact");
    }
  }, [inView, setActiveSection]);

  return (
    <section ref={ref} id="contact" className="py-16 mx-auto w-10/12">
      <Heading icon={<EnvelopeIcon className="w-8 text-gold" />}>
        Contact
      </Heading>
      <div className="mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12 animateProjectCard">
        <DialogForm closeModal={() => setOpenLetsContactDialog(false)} />
      </div>
    </section>
  );
};

export default Contact;
