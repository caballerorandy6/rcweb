import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

export const metadata = genPageMetadata({
  title: "Dulce Antojo Case Study - Website & Stripe Payments for a Houston Caterer",
  description:
    "How I took Dulce Antojo Snack Carts from Instagram-only to an official website with Stripe card payments, so a Houston event caterer could book companies and schools.",
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
            "How I took a Houston snack cart rental business from Instagram-only to an official website with Stripe card payments, so they could book companies and organizations, not just individuals.",
          siteUrl: "https://www.dulcesantojosnackcarts.com/",
          image: "/dulce-antojo.avif",
          imageAlt: "Dulce Antojo Snack Carts website screenshot",
          stats: [
            { value: "5", label: "Star Google Reviews", suffix: "★" },
            { value: "13", label: "Snack Cart Options", suffix: "+" },
            { value: "95", label: "Lighthouse Score", suffix: "+" },
            { value: "<2s", label: "Load Time", suffix: "" },
          ],
          techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Shadcn UI",
            "Zod",
            "Stripe",
            "Turso",
            "Resend",
          ],
          challengesIntro:
            "Before working with me, Dulce Antojo rented Mexican dessert and snack carts (mini pancakes, paletas locas, churro sundaes, elote cups) for events in Houston with no official website, only social media — and no way to accept card payments.",
          challenges: [
            {
              icon: "phone",
              title: "No Official Website",
              description:
                "The business operated entirely through Instagram DMs and word-of-mouth. Potential customers had no centralized place to see all 13+ snack cart options, pricing, or how to book, and there was zero Google presence.",
            },
            {
              icon: "chart",
              title: "Could Not Take Card Payments",
              description:
                "Corporations, schools and other organizations usually pay by card and need a proper receipt. Without card payments, Dulce Antojo could not take those bookings at all.",
            },
            {
              icon: "envelope",
              title: "No Lead or Payment Tracking",
              description:
                "Inquiries came through Instagram DMs, easy to miss and hard to track, and payments were scattered across messages and bank apps with no record of who had paid.",
            },
          ],
          solutionsIntro:
            "I built their official website with a booking form, and a private admin dashboard with Stripe payments so the owner can charge any client by card.",
          solutions: [
            {
              title: "Official Website Built to Book Events",
              description:
                "A modern, mobile-first website showcasing all 13+ snack cart options with a photo gallery, FAQ and a booking request form that captures event details (date, type, guests, preferred carts) and emails them instantly. Optimized for local search in Houston.",
              features: [
                "13+ snack cart service showcases",
                "Event booking form with validation",
                "LocalBusiness schema and Houston keyword targeting",
                "Fast loading under 2 seconds",
              ],
            },
            {
              title: "Stripe Payment Links from a Private Dashboard",
              description:
                "The owner creates a payment link for each event and sends it by text or email. The client pays in seconds on Stripe's secure checkout — card data never touches the business's servers — and both sides get an automatic email receipt.",
              features: [
                "Payment link per event, sent by SMS or email",
                "Stripe-hosted checkout with fraud protection and PCI compliance",
                "All major cards accepted, including corporate cards",
                "No monthly fee, only a fee per transaction",
              ],
            },
            {
              title: "Every Payment Recorded Automatically",
              description:
                "Stripe webhooks record each payment the moment it clears, so the dashboard always shows who paid, how much and when. Payments can be searched, receipted or refunded from one place, and admin credentials are stored encrypted and can be changed without a developer.",
              features: [
                "Webhooks that log every payment",
                "Paid, pending and followed-up status per booking",
                "Instant notification to the business",
                "Encrypted admin credentials the owner controls",
              ],
            },
          ],
          results: [
            {
              metric: "Companies and Schools as Clients",
              description:
                "Dulce Antojo can now book organizations that pay by card and need a receipt — not just individuals",
              icon: "chart",
            },
            {
              metric: "Bookings and Payments in One Place",
              description:
                "Every booking and payment is organized and under the owner's control, instead of scattered across messages",
              icon: "wrench",
            },
            {
              metric: "5-Star Client Review",
              description:
                "The owner praised the modern design and how easy it is for customers to book events",
              icon: "star",
            },
          ],
          ctaTitle: "Still Turning Away Clients Because",
          ctaTitleHighlight: "You Can't Take Cards?",
          ctaDescription:
            "I build websites with secure Stripe payments for Houston businesses. Let's discuss how a professional website can generate more leads and let you charge any client by card.",
          ctaLinks: [
            { label: "Schedule Free Consultation", href: "/schedule", primary: true },
            { label: "Web Design Services", href: "/services/web-design-houston" },
          ],
        }}
      />
    </>
  );
}
