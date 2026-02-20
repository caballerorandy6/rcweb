import { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResetPasswordForm from "@/components/client/ResetPasswordForm";
import { genPageMetadata } from "@/utils/genPageMetadata";
import type { Route } from "next";

export const metadata: Metadata = genPageMetadata({
  title: "Reset Password - Client Portal",
  description: "Reset your password for your RC Web Solutions client portal.",
  pageRoute: "/client/reset-password",
});

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage(props: Props) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  // If no token provided, redirect to forgot password
  if (!token) {
    redirect("/client/forgot-password?error=missing-token" as Route);
  }

  // Verify token is valid and not expired
  const client = await prisma.client.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(), // Token must not be expired
      },
    },
    select: {
      id: true,
      password: true, // Check if client has a password (required for reset)
    },
  });

  // If token is invalid or expired, redirect with error
  if (!client) {
    redirect("/client/forgot-password?error=invalid-token" as Route);
  }

  // If client doesn't have a password, redirect to setup password instead
  if (!client.password) {
    redirect("/client/setup-password?token=" + token as Route);
  }

  return (
    <section id="reset-password">
      <ResetPasswordForm token={token} />
    </section>
  );
}

