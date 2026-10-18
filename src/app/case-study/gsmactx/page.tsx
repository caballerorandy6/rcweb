import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

export const metadata = genPageMetadata({
  title: "GSM AC Case Study - HVAC Business Automation",
  description:
    "How I helped GSM A/C & General Contractor save 15 hours per week with a custom admin dashboard, automated email campaigns, and modern website. Full case study with results.",
  pageRoute: "/case-study/gsmactx",
});

export default function GsmacCaseStudyPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Case Studies", item: `${siteConfig.baseUrl}/case-study` },
          { name: "GSM AC", item: `${siteConfig.baseUrl}/case-study/gsmactx` },
        ]}
      />
      <CaseStudyTemplate
        data={{
          name: "GSM A/C &",
          nameHighlight: "General Contractor",
          subtitle:
            "How I helped a Houston HVAC company save 15+ hours per week with a custom admin dashboard and automated email marketing system.",
          siteUrl: "https://www.gsmactx.com/",
          image: "/gsmactx.avif",
          imageAlt: "GSM AC Website Screenshot",
          stats: [
            { value: "15", label: "Hours Saved Weekly", suffix: "+" },
            { value: "2", label: "Systems: Website + Admin", suffix: "" },
            { value: "95", label: "Lighthouse Score", suffix: "+" },
            { value: "1", label: "Send Reaches Every Customer", suffix: "" },
          ],
          techStack: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Tailwind UI",
            "Prisma",
            "PostgreSQL",
            "Docker",
            "Zod",
            "Zustand",
          ],
          challengesIntro:
            "Before working with me, GSM AC faced several operational challenges that were holding back business growth.",
          challenges: [
            {
              icon: "clock",
              title: "Time-Consuming Admin Tasks",
              description:
                "Michel was spending 15+ hours per week on repetitive administrative tasks like managing service requests, tracking leads, and sending follow-up emails manually.",
            },
            {
              icon: "wrench",
              title: "No Admin System",
              description:
                "Service requests, customer details and follow-ups were all managed by hand, and there was no way to email their customers: marketing relied on word-of-mouth and expensive traditional advertising.",
            },
            {
              icon: "phone",
              title: "Outdated Website",
              description:
                "The old website ran on obsolete technology: slow to load, poor on phones, and it was not turning visitors into service requests.",
            },
          ],
          solutionsIntro:
            "I built a comprehensive solution that addressed all challenges and transformed their business operations.",
          solutions: [
            {
              title: "Custom Admin Dashboard",
              description:
                "Built a comprehensive admin panel to manage service requests, customer data, and business operations from one place.",
              features: [
                "Real-time service request management",
                "Customer database with search & filters",
                "Automated status updates",
                "Analytics and reporting",
              ],
            },
            {
              title: "Bulk Email Campaign System",
              description:
                "Integrated email marketing capabilities allowing Michel to reach thousands of customers with promotional offers and updates.",
              features: [
                "Email template builder",
                "Contact list management",
                "Offers and updates to all customers in one send",
                "Admin accounts with password recovery",
              ],
            },
            {
              title: "Modern Responsive Website",
              description:
                "Rebuilt the public website from scratch with Next.js: a page for each service, online appointment booking, click-to-call and a financing link, with a focus on conversions and mobile experience.",
              features: [
                "Online appointment booking and click-to-call",
                "Mobile-first responsive design",
                "Local SEO for Cypress and Houston",
                "95+ Lighthouse performance score",
              ],
            },
          ],
          results: [
            {
              metric: "15+ Hours Saved Weekly",
              description:
                "Automated workflows eliminated repetitive manual tasks",
              icon: "clock",
            },
            {
              metric: "Increased Customer Reach",
              description:
                "Email campaigns now reach thousands of customers instantly",
              icon: "envelope",
            },
            {
              metric: "Better Lead Conversion",
              description:
                "Modern website converts more visitors into service requests",
              icon: "chart",
            },
          ],
          testimonial: {
            quote:
              "Randy transformed our business operations. The admin dashboard alone saves me over 15 hours every week. The email system lets me reach all my customers with just a few clicks. Highly recommend RC Web Solutions!",
            author: "Michel Chapelli",
            company: "Owner, GSM A/C & General Contractor Inc.",
          },
          ctaTitle: "Ready to Transform",
          ctaTitleHighlight: "Your Business?",
          ctaDescription:
            "Let's discuss how I can build a custom solution that saves you time and grows your business.",
          ctaLinks: [
            { label: "Start Your Project", href: "/#contact", primary: true },
            { label: "Schedule a Call", href: "/schedule" },
          ],
        }}
      />
    </>
  );
}
