import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import BackLink from "@/components/ui/BackLink";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";

export const metadata = genPageMetadata({
  title: "About Randy Caballero - Full-Stack Web Developer",
  description:
    "Learn about Randy Caballero, a full-stack developer with 6+ years of experience in React, Next.js, and TypeScript who has shipped 20+ production sites. Based in Houston, TX, serving clients nationwide.",
  pageRoute: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "About", item: `${siteConfig.baseUrl}/about` },
        ]}
      />
      <main className="bg-gray-900 min-h-screen">
        <BackLink href="/" label="Back to Home" />
        <About />
        <Experience />
        <Certifications />
      </main>
    </>
  );
}
