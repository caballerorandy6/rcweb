"use client";

import { useSearchParams } from "next/navigation";
import DialogForm, { type ServiceOption } from "@/components/forms/DialogForm";
import { isOfferId } from "@/lib/offerIds";

/**
 * The /schedule form: preselects the offer from ?service=<id> ("Get a Quote"
 * buttons). Reading the query here, under a Suspense boundary, keeps the page
 * static; anything that is not a catalogue id is ignored.
 */
export default function ScheduleForm({
  serviceOptions,
}: {
  serviceOptions: ServiceOption[];
}) {
  const requested = useSearchParams().get("service");

  return (
    <DialogForm
      serviceOptions={serviceOptions}
      defaultService={isOfferId(requested) ? requested : undefined}
      source="schedule_page"
    />
  );
}
