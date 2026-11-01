import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/company";
import Heading from "@/components/ui/Heading";
import {
  EnvelopeIcon,
  CalendarDaysIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import DialogForm from "@/components/forms/DialogForm";
import { getTranslations } from "next-intl/server";
import { getLocalizedCatalog } from "@/lib/catalog";

// Server Component; the form inside is the client island
const Contact = async () => {
  const [t, { offers }] = await Promise.all([
    getTranslations("Home.contact"),
    getLocalizedCatalog(),
  ]);
  const serviceOptions = offers.map(({ id, title }) => ({ id, title }));

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<EnvelopeIcon className="w-8 text-gold" />}
          text={t("subheading")}
        >
          {t("heading")}
        </Heading>

        {/* Quick Contact Options */}
        <div className="mx-auto max-w-2xl mt-8 mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button href="/schedule" size="lg">
            <CalendarDaysIcon className="w-5 h-5" />
            {t("schedule")}
          </Button>
          <Button href={COMPANY.phoneHref} variant="secondary">
            <PhoneIcon className="w-5 h-5" />
            {t("call", { phone: COMPANY.phoneDisplay })}
          </Button>
        </div>
        <p className="text-center text-white/70 mt-4 font-inter text-sm sm:text-base">
          {t("orMessage")}
        </p>
      </div>

        <div className="mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12 reveal">
          <DialogForm serviceOptions={serviceOptions} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
