import { Metadata } from "next";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { prisma } from "@/lib/prisma";
import SetupPasswordForm from "@/app/components/client/SetupPasswordForm";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata: Metadata = genPageMetadata({
  title: "Set Up Password - Client Portal",
  description:
    "Set up your password to access your RC Web Solutions client portal.",
  pageRoute: "/client/setup-password",
});

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function SetupPasswordPage(props: Props) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  // If no token provided, redirect to login
  if (!token) {
    redirect("/client/login?error=missing-token" as Route);
  }

  // Verify token is valid and not expired
  const client = await prisma.client.findFirst({
    where: {
      setupToken: token,
      setupTokenExpiry: {
        gte: new Date(), // Token must not be expired
      },
    },
    select: {
      id: true,
      password: true, // Check if password already set
    },
  });

  // If token is invalid or expired, redirect with error
  if (!client) {
    redirect("/client/login?error=invalid-token" as Route);
  }

  // If password already set, redirect to login
  if (client.password) {
    redirect("/client/login?error=password-already-set" as Route);
  }

  return (
    <section id="setup-password">
      <SetupPasswordForm token={token} />
    </section>
  );
}
