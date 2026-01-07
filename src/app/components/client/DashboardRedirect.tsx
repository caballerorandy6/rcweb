"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientDashboardSkeleton from "@/app/components/skeletons/ClientDashboardSkeleton";
import type { Route } from "next";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/client/dashboard" as Route);
  }, [router]);

  return <ClientDashboardSkeleton />;
}
