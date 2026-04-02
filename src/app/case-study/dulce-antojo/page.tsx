import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

export const metadata = genPageMetadata({
  title: "Dulce Antojo Case Study - Event Catering Landing Page Houston",
  description:
    "How we built a conversion-optimized landing page for Dulce Antojo Snack Carts, a Houston event catering business. Lead capture, SEO, and mobile-first design.",
  pageRoute: "/case-study/dulce-antojo",
});

export default function DulceAntojoCaseStudyPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Case Studies", item: `${siteConfig.baseUrl}/case-study` },
          { name: "Dulce Antojo", item: `${siteConfig.baseUrl}/case-study/dulce-antojo` },
        ]}
      />
      <CaseStudyTemplate
        data={{
          name: "Dulce Antojo",
          nameHighlight: "Snack Carts",
          subtitle:
            "How we built a conversion-optimized landing page for a Houston snack cart rental business that turns event planners into booked clients.",
          siteUrl: "https://www.dulcesantojosnackcarts.com/",
          image: "/dulce-antojo.avif",
          imageAlt: "Dulce Antojo Snack Carts website screenshot",
          stats: [
            { value: "5", label: "Star Google Reviews", suffix: "★" },
            { value: "13", label: "Snack Cart Options", suffix: "+" },
            { value: "95", label: "Lighthouse Score", suffix: "+" },
            { value: "<2s", label: "Load Time", suffix: "" },
          ],
          techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod"],
          challengesIntro:
            "Before working with us, Dulce Antojo relied solely on Instagram to book events — limiting their reach and making it hard for customers to see all services at once.",
          challenges: [
            {
              icon: "phone",
              title: "No Professional Website",
              description:
                "The business operated entirely through Instagram DMs and word-of-mouth. Potential customers had no centralized place to see all 13+ snack cart options, pricing, or how to book.",
            },
            {
              icon: "search",
              title: "Invisible on Google",
              description:
                "Without a website, there was zero Google presence. Event planners searching for 'snack cart Houston' or 'mini pancakes catering Houston' had no way to find Dulce Antojo.",
            },
            {
              icon: "envelope",
              title: "No Lead Capture System",
              description:
                "All inquiries came through Instagram DMs, which were easy to miss and hard to track. There was no structured way to capture customer information for follow-up.",
            },
          ],
          solutionsIntro:
            "We built a professional landing page designed to convert event planners into booked clients.",
          solutions: [
            {
              title: "Conversion-Optimized Landing Page",
              description:
                "A modern, mobile-first landing page showcasing all 13+ snack cart options with detailed descriptions, pricing hints, and high-quality imagery. Designed to move visitors from browsing to booking.",
              features: [
                "13+ snack cart service showcases",
                "Mobile-first responsive design",
                "Strategic CTA placement throughout",
                "Fast loading under 2 seconds",
              ],
            },
            {
              title: "Lead Capture & Contact Form",
              description:
                "Interactive booking form that captures event details — date, event type, number of guests, and preferred cart options. Every submission sends an instant email notification with all the info needed to follow up.",
              features: [
                "Event booking form with validation",
                "Instant email notifications",
                "Event details captured (date, type, guests)",
                "Spam protection with Zod validation",
              ],
            },
            {
              title: "Local SEO for Houston Events",
              description:
                "Implemented local SEO targeting Houston event-related searches. Schema markup and optimized content help the business appear when event planners search for catering options.",
              features: [
                "LocalBusiness schema markup",
                "Houston event keyword targeting",
                "Optimized meta tags and descriptions",
                "Social media integration (Instagram)",
              ],
            },
          ],
          results: [
            {
              metric: "Professional Online Presence",
              description: "Customers can now browse all services, see pricing, and book directly — not just through Instagram DMs",
              icon: "globe",
            },
            {
              metric: "Event Leads via Website",
              description: "Event planners find and contact the business through the structured booking form",
              icon: "envelope",
            },
            {
              metric: "5-Star Client Review",
              description: "The owner praised the modern design and how easy it is for customers to book events",
              icon: "star",
            },
          ],
          ctaTitle: "Need a Landing Page for",
          ctaTitleHighlight: "Your Business?",
          ctaDescription:
            "I build conversion-optimized landing pages for Houston businesses. Let's discuss how a professional website can generate more leads for your business.",
          ctaLinks: [
            { label: "Schedule Free Consultation", href: "/schedule", primary: true },
            { label: "Web Design Services", href: "/services/web-design-houston" },
          ],
        }}
      />
    </>
  );
}
