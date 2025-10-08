import SendSmsCampaign from "@/app/components/SendSmsCampaign";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "SMS Campaigns",
  description: "Send SMS campaigns for RC Web Solutions LLC.",
  pageRoute: "/sms",
});

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
