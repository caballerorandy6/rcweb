import LoginForm from "@/app/components/auth/LoginForm";
import { genPageMetadata } from "@/utils/genPageMetadata";
import type { Route } from "next";

export const metadata = genPageMetadata({
  title: "Admin Login",
  description: "Admin login page for RC Web Solutions LLC dashboard access.",
  pageRoute: "/admin/login",
});

const LoginPage = () => {
  return (
    <section id="admin-login">
      <LoginForm
        title="Admin Login"
        subtitle="Access to admin dashboard"
        redirectPath={"/admin-dashboard" as Route}
        footerText="Protected area • RC Web Admin"
      />
    </section>
  );
};

export default LoginPage;

