import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import About from "@/app/components/sections/About";
import Experience from "@/app/components/sections/Experience";
import Certifications from "@/app/components/sections/Certifications";

export const metadata = genPageMetadata({
  title: "About Randy Caballero - Full-Stack Web Developer",
  description:
    "Learn about Randy Caballero, a Full-Stack Web Developer with 5+ years of experience in React, Next.js, and TypeScript. Based in Houston, TX, serving clients nationwide.",
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
        <About />
        <Experience />
        <Certifications />
      </main>
    </>
  );
}
