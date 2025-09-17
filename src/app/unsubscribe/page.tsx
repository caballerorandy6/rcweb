import { Suspense } from "react";
import Spinner from "@/app/components/Spinner";
import Unsubscribe from "@/app/components/Unsubscribe";

const UnsubscribePage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Unsubscribe />
    </Suspense>
  );
};

export default UnsubscribePage;
