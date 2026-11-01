import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/company";
import type { Metadata } from "next";

import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { JsonLdForLocalBusiness } from "@/components/seo/JsonLdForLocalBusiness";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import BackLink from "@/components/ui/BackLink";
import {
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

type Props = PageProps<"/[locale]/web-developer-houston-tx">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Houston" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/web-developer-houston-tx",
  });
}

const houstonAreas = [
  "Downtown Houston",
  "The Heights",
  "Katy",
  "Sugar Land",
  "Cypress",
  "Spring",
  "Pearland",
  "Pasadena",
  "The Woodlands",
  "East Houston",
  "Bellaire",
  "Missouri City",
  "Richmond",
  "Humble",
  "League City",
];

// Icons per "why hire" card; the copy is Houston.services in the dictionaries
const serviceIcons = [
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
];

// Names and links of the featured Houston clients; result and industry come from the dictionaries
const caseStudyLinks = [
  { name: "Clínica Hispana Nueva Salud Gessner", url: "https://www.clinicagessner.com/" },
  { name: "Clínica Hispana Airline", url: "https://www.clinicahispanaairline.com/" },
  { name: "GSM A/C & General Contractor", url: "/case-study/gsmactx" },
  { name: "Leo's Home Experts", url: "https://www.ac-remodelingservice.com/" },
  { name: "Dulce Antojo Snack Carts", url: "https://dulce-antojo-snack-carts.vercel.app/" },
];

export default async function WebDeveloperHoustonPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [t, common, crumbs] = await Promise.all([
    getTranslations("Houston"),
    getTranslations("Common"),
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { key: "houston", pathname: "/web-developer-houston-tx" },
    ]),
  ]);
  const services = (t.raw("services") as { title: string; description: string }[]).map(
    (service, i) => ({ ...service, icon: serviceIcons[i] })
  );
  const caseStudies = (t.raw("caseStudies") as { result: string; industry: string }[]).map(
    (study, i) => ({ ...study, ...caseStudyLinks[i] })
  );
  const whatYouGet = t.raw("whatYouGet") as string[];

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <JsonLdForLocalBusiness />

      <div className="bg-gray-950">
        <BackLink href="/" label={common("backToHome")} />
        {/* Hero Section */}
        <section className="relative pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="absolute inset-0 bg-linear-to-b from-gold/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold mb-8">
                <MapPinIcon className="h-4 w-4" />
                {t("badge")}
              </div>

              <h1 className="text-4xl tracking-tight text-white sm:text-6xl font-iceland">
                {t("title")} <span className="text-gold">{t("titleHighlight")}</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">{t("intro")}</p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/schedule" size="lg">
                  <CalendarDaysIcon className="h-5 w-5" />
                  {t("freeConsultation")}
                </Button>
                <Button href={COMPANY.phoneHref} variant="secondary">
                  <PhoneIcon className="h-5 w-5" />
                  {COMPANY.phoneDisplay}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose a Local Houston Developer */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl tracking-tight text-white sm:text-4xl font-iceland">
                {t("whyTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-400 font-inter">{t("whyText")}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 shadow-lg shadow-black/20 transition duration-200 hover:border-gold/50 hover:bg-gold/5"
                >
                  <service.icon className="h-8 w-8 text-gold mb-4" />
                  <h3 className="text-2xl text-white font-iceland">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-gray-400 font-inter leading-7">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Houston Case Studies */}
        <section className="py-20 sm:py-28 bg-white/2">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl tracking-tight text-white sm:text-4xl font-iceland">
                {t("helpedTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-400 font-inter">{t("helpedText")}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <a
                  key={study.name}
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 shadow-lg shadow-black/20 transition duration-200 hover:border-gold/50 hover:bg-gold/5"
                >
                  <span className="text-sm font-medium text-gold/70 font-inter">
                    {study.industry}
                  </span>
                  <h3 className="mt-2 text-2xl text-white font-iceland group-hover:text-gold transition-colors">
                    {study.name}
                  </h3>
                  <p className="mt-3 text-gray-400 font-inter leading-7">
                    {study.result}
                  </p>
                  <span className="mt-4 inline-flex text-sm font-medium text-gold group-hover:underline font-inter">
                    {t("viewProject")} &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Areas Served */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl tracking-tight text-white sm:text-4xl font-iceland">
                {t("areasTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-400 font-inter">{t("areasText")}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {houstonAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 font-inter"
                >
                  <MapPinIcon className="h-3.5 w-3.5 text-gold/70" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 sm:py-28 bg-white/2">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl tracking-tight text-white sm:text-4xl font-iceland">
                {t("whatYouGetTitle")}
              </h2>
            </div>

            <div className="mx-auto max-w-3xl">
              {whatYouGet.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 py-4 border-b border-white/5 last:border-b-0"
                >
                  <CheckCircleIcon className="h-6 w-6 shrink-0 text-gold" />
                  <p className="text-gray-300 font-inter">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl tracking-tight text-white sm:text-4xl font-iceland">
                {t("ctaTitle")}
              </h2>
              <p className="mt-6 text-lg text-gray-400 font-inter">{t("ctaText")}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/schedule" size="lg">
                  <CalendarDaysIcon className="h-5 w-5" />
                  {t("scheduleCta")}
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-500 font-inter">
                {common("orCall")}{" "}
                <a href={COMPANY.phoneHref} className="text-gold hover:underline">
                  {COMPANY.phoneDisplay}
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
