import { Suspense } from "react";
import TermsOfService from "@/app/components/Sections/TermsOfService";

// Loading component para el Suspense
function TermsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gold text-lg">Loading terms...</div>
    </div>
  );
}

const TermsOfServicePage = () => {
  return (
    <section id="terms-of-service">
      <Suspense fallback={<TermsLoading />}>
        <TermsOfService />
      </Suspense>
    </section>
  );
};

export default TermsOfServicePage;
