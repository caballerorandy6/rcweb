import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

export const metadata = genPageMetadata({
  title: "Clinica Hispana Airline Case Study - Bilingual Healthcare Website",
  description:
    "How we helped Clinica Hispana Airline replace their WordPress site with a modern bilingual website. Lead capture, Google Business integration, and local SEO for Houston.",
  pageRoute: "/case-study/clinica-airline",
});

export default function ClinicaAirlineCaseStudyPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Case Studies", item: `${siteConfig.baseUrl}/case-study` },
          { name: "Clinica Airline", item: `${siteConfig.baseUrl}/case-study/clinica-airline` },
        ]}
      />
      <CaseStudyTemplate
        data={{
          name: "Clinica Hispana",
          nameHighlight: "Airline",
          subtitle:
            "How we built a modern bilingual website that connects a Houston clinic near Airline Drive with the Hispanic community they serve.",
          siteUrl: "https://www.clinicahispanaairline.com/",
          image: "/clinica-hispana-airline.avif",
          imageAlt: "Clinica Hispana Airline website screenshot",
          stats: [
            { value: "5", label: "Star Google Reviews", suffix: "★" },
            { value: "2", label: "Languages (EN/ES)", suffix: "" },
            { value: "95", label: "Lighthouse Score", suffix: "+" },
            { value: "<2s", label: "Load Time", suffix: "" },
          ],
          techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod"],
          challengesIntro:
            "Before working with us, Clinica Hispana Airline was missing the online presence needed to serve their community effectively.",
          challenges: [
            {
              icon: "phone",
              title: "Outdated WordPress Site",
              description:
                "The clinic's WordPress website was slow, not mobile-optimized, and looked outdated. It didn't reflect the professional healthcare services they provide near Airline Drive.",
            },
            {
              icon: "globe",
              title: "Missing Spanish Content",
              description:
                "The majority of their patients are Spanish-speaking, yet the website had no proper Spanish version. Patients couldn't browse services in their preferred language.",
            },
            {
              icon: "search",
              title: "Poor Google Visibility",
              description:
                "No SEO strategy, no schema markup, and no connection to their Google Business Profile. Patients searching for healthcare near Airline Drive couldn't find them.",
            },
          ],
          solutionsIntro:
            "We built a modern bilingual website that serves as the clinic's primary patient acquisition channel.",
          solutions: [
            {
              title: "Modern Bilingual Website",
              description:
                "Built from scratch with Next.js. Native Spanish content written by a native speaker ensures patients feel comfortable and trust the clinic from their first online interaction.",
              features: [
                "Native Spanish content (not machine translated)",
                "Mobile-first design for phone searches",
                "Professional healthcare-focused layout",
                "Fast loading under 2 seconds",
              ],
            },
            {
              title: "Patient Lead Capture",
              description:
                "Contact form that captures patient information and instantly notifies the clinic via email. Every potential patient's details arrive in the clinic's inbox within seconds.",
              features: [
                "Patient inquiry form with validation",
                "Instant email notifications",
                "Complete patient details in every lead",
                "Protected against spam submissions",
              ],
            },
            {
              title: "Local SEO & Google Integration",
              description:
                "Full local SEO targeting the Airline Drive area and broader Houston Hispanic community. Google Business Profile recognizes the new website as the clinic's official presence.",
              features: [
                "LocalBusiness schema markup",
                "Google Business Profile integration",
                "Houston healthcare search targeting",
                "Bilingual meta tags and SEO",
              ],
            },
          ],
          results: [
            {
              metric: "Google Visibility",
              description: "The clinic now appears in local searches for Hispanic healthcare services near Airline Drive",
              icon: "search",
            },
            {
              metric: "Online Patient Leads",
              description: "New patients discover and contact the clinic directly through the website's lead capture form",
              icon: "envelope",
            },
            {
              metric: "5-Star Client Review",
              description: "The clinic gave a 5-star review recognizing the quality and professionalism of the new website",
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
