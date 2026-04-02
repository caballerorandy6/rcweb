import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

export const metadata = genPageMetadata({
  title: "Leo's Home Experts Case Study - Home Services Website Houston",
  description:
    "How we built a modern website for Leo's Home Experts, a Houston home services company. Lead capture, video gallery, local SEO, and Google Business integration.",
  pageRoute: "/case-study/leos-home-experts",
});

export default function LeosHomeExpertsCaseStudyPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Case Studies", item: `${siteConfig.baseUrl}/case-study` },
          { name: "Leo's Home Experts", item: `${siteConfig.baseUrl}/case-study/leos-home-experts` },
        ]}
      />
      <CaseStudyTemplate
        data={{
          name: "Leo's Home",
          nameHighlight: "Experts",
          subtitle:
            "How we built a professional website for a Houston home services company specializing in patio construction, motorized screens, and awning installations.",
          siteUrl: "https://www.ac-remodelingservice.com/",
          image: "/leos-home-experts.webp",
          imageAlt: "Leo's Home Experts website screenshot",
          stats: [
            { value: "5", label: "Star Google Reviews", suffix: "★" },
            { value: "150", label: "Mile Service Radius", suffix: "mi" },
            { value: "95", label: "Lighthouse Score", suffix: "+" },
            { value: "<2s", label: "Load Time", suffix: "" },
          ],
          techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod", "React Hook Form"],
          challengesIntro:
            "Before working with us, Leo's Home Experts had no professional online presence to showcase their quality craftsmanship to Houston homeowners.",
          challenges: [
            {
              icon: "phone",
              title: "No Professional Website",
              description:
                "The business relied on word-of-mouth and social media but had no dedicated website. Potential customers searching for patio builders or motorized screens in Houston couldn't find them online.",
            },
            {
              icon: "video",
              title: "No Way to Showcase Work",
              description:
                "Leo's team produces high-quality patio and screen installations, but had no professional platform to display their video portfolio and project photos to prospective clients.",
            },
            {
              icon: "search",
              title: "Invisible on Google",
              description:
                "Without a website, there was no SEO presence. Homeowners searching for 'patio builder Houston' or 'motorized screens Houston' had no way to discover the business.",
            },
          ],
          solutionsIntro:
            "We built a professional landing page optimized for lead generation and local visibility across the Greater Houston area.",
          solutions: [
            {
              title: "Professional Landing Page",
              description:
                "A modern, mobile-first website showcasing all three service lines with clear descriptions, warranty information, and strong calls-to-action. Designed to build trust with homeowners from the first visit.",
              features: [
                "Service showcases for patios, screens, and awnings",
                "Warranty information (5-year motors, lifetime frame)",
                "Mobile-first responsive design",
                "Fast loading under 2 seconds",
              ],
            },
            {
              title: "Video Gallery & Lead Capture",
              description:
                "Integrated a video gallery showcasing completed projects so homeowners can see the quality of work before contacting. A lead capture form with service selection sends instant notifications.",
              features: [
                "Video gallery of completed projects",
                "Lead capture form with service dropdown",
                "Instant email notifications to Leo's team",
                "Form validation with React Hook Form + Zod",
              ],
            },
            {
              title: "Local SEO for Houston Area",
              description:
                "Implemented local SEO targeting the Houston metropolitan area and surrounding 150-mile radius. Schema markup and Google Business Profile integration ensure the business appears in local searches.",
              features: [
                "JSON-LD LocalBusiness schema markup",
                "Google Business Profile integration",
                "Houston home services keyword targeting",
                "Service area coverage (150-mile radius)",
              ],
            },
          ],
          results: [
            {
              metric: "Professional Online Presence",
              description: "The business now has a dedicated website that showcases their craftsmanship and builds trust",
              icon: "wrench",
            },
            {
              metric: "Lead Generation",
              description: "Homeowners find and contact the business directly through the website's lead capture form",
              icon: "envelope",
            },
            {
              metric: "5-Star Client Review",
              description: "Leonardo praised the clean, modern design and professional results",
              icon: "star",
            },
          ],
          testimonial: {
            quote:
              "Working with Randy from RC Web Solutions LLC was a great experience. He was professional, responsive, and really took the time to understand my business. The website turned out clean, modern, and easy for customers to use. I'm very happy with the results and would definitely recommend him to anyone needing a professional website.",
            author: "Leonardo Lecour Acosta",
            company: "Leo's Home Experts",
          },
          ctaTitle: "Need a Website for",
          ctaTitleHighlight: "Your Home Services Business?",
          ctaDescription:
            "I build websites for Houston contractors and home service companies. Let's discuss how a professional website can generate leads for your business.",
          ctaLinks: [
            { label: "Schedule Free Consultation", href: "/schedule", primary: true },
            { label: "Web Design Services", href: "/services/web-design-houston" },
          ],
        }}
      />
    </>
  );
}
