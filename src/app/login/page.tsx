import AdminLoginForm from "@/app/components/admin/AdminLoginForm";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Admin Login",
  description: "Admin login page for RC Web Solutions LLC dashboard access.",
  pageRoute: "/login",
});

const LoginPage = () => {
  return (
    <section id="login">
      <AdminLoginForm />
    </section>
  );
};

export default LoginPage;
