import Unsubscribe from "@/app/components/Unsubscribe";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Unsubscribe",
  description: "Unsubscribe from RC Web Solutions LLC email communications.",
  pageRoute: "/unsubscribe",
});

export default function UnsubscribePage() {
  return (
    <section id="unsubscribe-page">
      <Unsubscribe />
    </section>
  );
}
