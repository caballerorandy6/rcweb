import Layout from "../components/layout";
import ContactHeader from "../components/contactHeader";
import ContactForm from "../components/contactForm";

const Contact = () => {
  return (
    <Layout
      title={"Contact"}
      description={"Contact page, personal portfolio, rcweb"}
    >
      <ContactHeader />
      <ContactForm />
    </Layout>
  );
};

export default Contact;
