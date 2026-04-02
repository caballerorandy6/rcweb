import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

export const metadata = genPageMetadata({
  title: "Clinica Hispana Gessner Case Study - Bilingual Healthcare Website",
  description:
    "How we helped Clinica Hispana Gessner replace their outdated WordPress site with a modern bilingual website. Lead capture, Google Business integration, and local SEO.",
  pageRoute: "/case-study/clinica-gessner",
});

export default function ClinicaGessnerCaseStudyPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Case Studies", item: `${siteConfig.baseUrl}/case-study` },
          { name: "Clinica Gessner", item: `${siteConfig.baseUrl}/case-study/clinica-gessner` },
        ]}
      />
      <CaseStudyTemplate
        data={{
          name: "Clinica Hispana",
          nameHighlight: "Gessner",
          subtitle:
            "How we replaced an outdated WordPress site with a modern bilingual website that helps Houston's Hispanic community find and contact the clinic online.",
          siteUrl: "https://www.clinicagessner.com/",
          image: "/clinica-gessner.avif",
          imageAlt: "Clinica Hispana Gessner website screenshot",
          stats: [
            { value: "5", label: "Star Google Reviews", suffix: "★" },
            { value: "2", label: "Languages (EN/ES)", suffix: "" },
            { value: "95", label: "Lighthouse Score", suffix: "+" },
            { value: "<2s", label: "Load Time", suffix: "" },
          ],
          techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod"],
          challengesIntro:
            "Before working with us, Clinica Gessner was struggling to connect with patients online despite serving a large Hispanic community in Houston.",
          challenges: [
            {
              icon: "phone",
              title: "Outdated WordPress Site",
              description:
                "The clinic had an old WordPress website that was slow, difficult to update, and didn't represent the quality of care they provide. Not mobile-friendly — a problem when most patients search from their phones.",
            },
            {
              icon: "globe",
              title: "No Bilingual Presence",
              description:
                "Despite serving Houston's Hispanic community, the website didn't have proper Spanish content. Patients who preferred Spanish had no way to browse services or book appointments in their language.",
            },
            {
              icon: "search",
              title: "Invisible on Google",
              description:
                "No SEO optimization, no schema markup, and no Google Business Profile integration. Patients searching for 'clinica hispana Houston' couldn't find them online.",
            },
          ],
          solutionsIntro:
            "We built a complete digital presence from scratch that connects the clinic with Houston's Hispanic community.",
          solutions: [
            {
              title: "Modern Bilingual Website",
              description:
                "Built from scratch with Next.js, featuring native Spanish content written by a native speaker — not machine translated. Proper hreflang tags for bilingual SEO.",
              features: [
                "Native Spanish localization",
                "Mobile-first responsive design",
                "Fast loading (under 2 seconds)",
                "Professional, trust-building design",
              ],
            },
            {
              title: "Lead Capture System",
              description:
                "Contact form that captures patient information and sends instant email notifications to the clinic. Every new lead arrives in their inbox with all details needed to follow up.",
              features: [
                "Patient contact form with validation",
                "Instant email notifications to clinic",
                "Complete patient info in every email",
                "Spam protection with Zod validation",
              ],
            },
            {
              title: "Local SEO & Google Integration",
              description:
                "Comprehensive local SEO with schema markup, optimized meta tags for Houston healthcare searches, and Google Business Profile integration.",
              features: [
                "LocalBusiness schema markup",
                "Google Business Profile integration",
                "Houston-targeted meta tags",
                "Bilingual SEO optimization",
              ],
            },
          ],
          results: [
            {
              metric: "Found on Google",
              description: "The clinic now appears in Google searches for Spanish healthcare terms in Houston",
              icon: "search",
            },
            {
              metric: "Patient Leads via Website",
              description: "New patients find and contact the clinic directly through the website contact form",
              icon: "envelope",
            },
            {
              metric: "5-Star Client Review",
              description: "The clinic left a 5-star review praising the professional results and bilingual service",
              icon: "star",
            },
          ],
          ctaTitle: "Need a Website for",
          ctaTitleHighlight: "Your Clinic?",
          ctaDescription:
            "I build bilingual websites for Houston healthcare providers. Let's discuss how a modern website can bring more patients to your practice.",
          ctaLinks: [
            { label: "Schedule Free Consultation", href: "/schedule", primary: true },
            { label: "Bilingual Website Services", href: "/services/bilingual-websites-houston" },
          ],
        }}
      />
    </>
  );
}
