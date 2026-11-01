import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import CertificationsList from "@/components/sections/CertificationsList";
import { getTranslations } from "next-intl/server";
import { getLocalizedResume } from "@/lib/catalog";

const Certifications = async () => {
  const [t, { certifications }] = await Promise.all([
    getTranslations("About.certifications"),
    getLocalizedResume(),
  ]);
  const labels = {
    previous: t("previous"),
    next: t("next"),
    seePdf: t("seePdf"),
    seeCertificate: t("seeCertificate"),
    download: t("download"),
    pdfCertificate: t("pdfCertificate"),
  };

  return (
    <section
      id="certifications"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CheckCircleIcon className="w-8 text-gold" />}
          text={t("subheading")}
        >
          {t("heading")}
        </Heading>

        <CertificationsList certifications={certifications} labels={labels} />
      </div>
    </section>
  );
};

export default Certifications;
