"use client";

import { useRCWebStore } from "@/store/rcweb-store";
import Heading from "@/app/components/Heading";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import DialogForm from "@/app/components/DialogForm";
import useSectionObserver from "@/hooks/useSectionObserver";

const Contact = () => {
  const { setOpenLetsContactDialog } = useRCWebStore();
  const ref = useSectionObserver({ sectionName: "Contact" });

  return (
    <section ref={ref} id="contact" className="py-32 mx-auto w-10/12">
      <Heading icon={<EnvelopeIcon className="w-8 text-gold" />} level={3}>
        Contact
      </Heading>
      <div className="mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12 animateProjectCard">
        <DialogForm closeModal={() => setOpenLetsContactDialog(false)} />
      </div>
    </section>
  );
};

export default Contact;
