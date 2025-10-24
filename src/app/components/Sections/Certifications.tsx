import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/ui/Heading";
import CertificationsList from "@/app/components/Sections/CertificationsList";
import { certifications } from "@/lib/data";

const Certifications = () => {
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

      <CertificationsList certifications={certifications} />
    </section>
  );
};

export default Certifications;
