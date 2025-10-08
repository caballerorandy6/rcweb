import Unsubscribe from "@/app/components/Unsubscribe";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from RC Web Solutions LLC email communications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribePage() {
  return (
    <section id="unsubscribe-page">
      <Unsubscribe />
    </section>
  );
}
