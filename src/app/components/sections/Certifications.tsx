import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/ui/Heading";
import CertificationsList from "@/app/components/sections/CertificationsList";
import { certifications } from "@/lib/data";

const Certifications = () => {
  return (
    <section
      id="certifications"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CheckCircleIcon className="w-8 text-gold" />}
          text="Learn and grow is my priority"
        >
          Degrees & Certifications
        </Heading>

        <CertificationsList certifications={certifications} />
      </div>
    </section>
  );
};

export default Certifications;
