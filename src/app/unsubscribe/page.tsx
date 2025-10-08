import Unsubscribe from "@/app/components/Unsubscribe";
import UnsubscribeSkeleton from "@/app/components/UnsubscribeSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { Suspense } from "react";

export const metadata = genPageMetadata({
  title: "Unsubscribe",
  description: "Unsubscribe from RC Web Solutions LLC email communications.",
  pageRoute: "/unsubscribe",
});

export default function UnsubscribePage() {
  return (
    <section id="unsubscribe-page">
      <Suspense fallback={<UnsubscribeSkeleton />}>
        <Unsubscribe />
      </Suspense>
    </section>
  );
}
