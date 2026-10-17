"use client";

import Button from "@/components/ui/Button";
import { useCheckoutStore } from "@/store/checkout-store";

interface PlanCTAProps {
  planId: string;
  featured: boolean;
  children: React.ReactNode;
}

/** Card button: the only client bit of each pricing card */
export default function PlanCTA({ planId, featured, children }: PlanCTAProps) {
  const open = useCheckoutStore((state) => state.open);

  return (
    <Button
      variant={featured ? "primary" : "secondary"}
      size="lg"
      fullWidth
      className="mt-8"
      onClick={() => open(planId)}
    >
      {children}
    </Button>
  );
}
