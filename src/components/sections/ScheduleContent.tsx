import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import DialogForm, { type ServiceOption } from "@/components/forms/DialogForm";
import ScheduleChannels from "@/components/sections/ScheduleChannels";
import CalendlyEmbed from "@/components/sections/CalendlyEmbed";
import type { OfferId } from "@/lib/offerIds";

const steps = [
  {
    title: "Tell me what you need",
    description:
      "Send the form or write to me on the channel you prefer. I reply within 24 hours, usually much sooner.",
  },
  {
    title: "We agree on the scope",
    description:
      "A short conversation, by phone, WhatsApp or email, to understand your business and what the first version must do.",
  },
  {
    title: "You get a quote and we start",
    description:
      "A written quote with a secure Stripe payment link: 50% to start, 50% on delivery, and a private link to follow the progress.",
  },
];

interface ScheduleContentProps {
  serviceOptions: ServiceOption[];
  defaultService?: OfferId;
}

/**
 * /schedule: the single place every "Get a Quote" button lands. Server
 * Component; the form, the call tracking and Calendly are client islands.
 */
export default function ScheduleContent({
  serviceOptions,
  defaultService,
}: ScheduleContentProps) {
  return (
    <section className="relative isolate overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28 bg-linear-to-b from-gray-900 via-gray-900/95 to-gray-900">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          as="h1"
          icon={<ChatBubbleLeftRightIcon className="w-8 text-gold" />}
          text="Tell me what you need and how you'd like me to reach you. No account, no commitment: you get a clear quote and decide from there."
        >
          Let&apos;s Talk About Your Project
        </Heading>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Form: the same one as the home, with the offer preselected */}
          <div className="lg:col-span-3">
            <DialogForm
              serviceOptions={serviceOptions}
              defaultService={defaultService}
              source="schedule_page"
            />
          </div>

          {/* Direct channels */}
          <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-28">
            <div className="bg-gray-900/60 rounded-2xl border border-gold/20 p-6 sm:p-8">
              <h2 className="text-2xl text-gold font-iceland mb-2">
                Prefer to talk now?
              </h2>
              <p className="text-gray-400 font-inter text-sm mb-6">
                Same person on every channel. If I can&apos;t pick up, I get
                back to you the same business day.
              </p>
              <ScheduleChannels />
            </div>

            <div className="bg-gray-900/60 rounded-2xl border border-gold/20 p-6 sm:p-8">
              <h2 className="text-2xl text-gold font-iceland mb-2">
                Or book a free 30-minute call
              </h2>
              <p className="text-gray-400 font-inter text-sm mb-6">
                Video or phone, whichever you prefer. Pick the slot that suits
                you and I&apos;ll send the invitation.
              </p>
              <CalendlyEmbed />
            </div>
          </aside>
        </div>

        {/* What happens next */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl text-gold font-iceland mb-8 text-center">
            What Happens Next
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="reveal bg-gray-900/60 rounded-2xl border border-gold/20 p-6"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold font-iceland text-xl mb-4">
                  {index + 1}
                </span>
                <h3 className="text-xl text-white font-iceland mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm font-inter leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
