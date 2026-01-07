import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/app/components/client/ProfileForm";
import ChangePasswordForm from "@/app/components/client/ChangePasswordForm";
import { genPageMetadata } from "@/utils/genPageMetadata";
import type { Route } from "next";

export const metadata: Metadata = genPageMetadata({
  title: "Profile Settings - Client Portal",
  description: "Manage your profile information and change your password.",
  pageRoute: "/client/profile",
});

export default async function ClientProfilePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/login" as Route);
  }

  // Get client data
  const client = await prisma.client.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!client) {
    redirect("/client/login" as Route);
  }

  return (
    <section
      id="client-profile"
      className="pt-24 sm:pt-32 min-h-screen bg-gray-900"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl text-gold font-bold font-iceland mb-8">
          Profile Settings
        </h1>

        <div className="space-y-8">
          {/* Profile Information Section */}
          <div className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700/50">
            <h2 className="text-2xl text-gold font-semibold font-inter mb-6">
              Personal Information
            </h2>
            <ProfileForm
              initialData={{
                name: client.name,
                email: client.email,
                phone: client.phone,
              }}
            />
          </div>

          {/* Change Password Section */}
          <div className="bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-700/50">
            <h2 className="text-2xl text-gold font-semibold font-inter mb-6">
              Change Password
            </h2>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}
