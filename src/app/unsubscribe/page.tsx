import { Suspense } from "react";
import Spinner from "@/app/components/Spinner";
import Unsubscribe from "@/app/components/Unsubscribe";

const UnsubscribePage = () => {
  return (
    <section id="unsubscribe-page">
      <Suspense fallback={<Spinner />}>
        <Unsubscribe />
      </Suspense>
    </section>
  );
};

export default UnsubscribePage;
