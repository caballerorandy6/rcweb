import Newsletter from "@/app/components/SendNewsletterCampaign";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Campaigns",
  description: "Send newsletter campaigns for RC Web Solutions LLC.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewsletterPage() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <section id="newsletter">
      <Newsletter />
    </section>
  );
}
