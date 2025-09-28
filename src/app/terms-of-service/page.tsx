//import { use } from "react";
import TermsOfService from "@/app/components/Sections/TermsOfService";

//type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const TermsOfServicePage = () => {
  //const searchParams = use(props.searchParams);
  //const paymentId = searchParams.paymentId as string | undefined;

  return (
    <section id="terms-of-service">
      <TermsOfService />
    </section>
  );
};

export default TermsOfServicePage;
