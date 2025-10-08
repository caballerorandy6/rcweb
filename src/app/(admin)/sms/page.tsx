import SendSmsCampaign from "@/app/components/SendSmsCampaign";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Campaigns",
  description: "Send SMS campaigns for RC Web Solutions LLC.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SMSPage() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <section id="sms">
      <SendSmsCampaign />
    </section>
  );
}
