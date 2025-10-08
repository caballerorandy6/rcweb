import AdminLoginForm from "@/app/components/AdminLoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login page for RC Web Solutions LLC dashboard access.",
  robots: {
    index: false, // Don't index login pages
    follow: false,
  },
};

const LoginPage = () => {
  return (
    <section id="login">
      <AdminLoginForm />
    </section>
  );
};

export default LoginPage;
