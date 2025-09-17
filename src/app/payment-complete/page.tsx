import { Suspense } from "react";
import Spinner from "@/app/components/Spinner";
import PaymentComplete from "@/app/components/PaymentComplete";

const PaymentCompletePage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <PaymentComplete />
    </Suspense>
  );
};

export default PaymentCompletePage;
