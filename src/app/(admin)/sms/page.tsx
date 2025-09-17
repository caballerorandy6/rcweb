import { Suspense } from "react";
import SendSmsCampaign from "@/app/components/SendSmsCampaign";
import Spinner from "@/app/components/Spinner";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SMSPage = async () => {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <section id="sms">
      <Suspense fallback={<Spinner />}>
        <SendSmsCampaign />
      </Suspense>
    </section>
  );
};

export default SMSPage;
