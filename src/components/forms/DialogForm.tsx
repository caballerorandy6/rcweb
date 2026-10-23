"use client";

import { useRCWebStore } from "@/store/rcweb-store";
import Button from "@/components/ui/Button";
import { useEffect, useTransition, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { FormSchema, FormData } from "@/lib/zod";
import { toast } from "sonner";
import { createContactAction } from "@/actions/contacts/createContactAction";
import { trackContactFormSubmit, trackSubmitLeadForm } from "@/lib/analytics";
import { trackFBLead } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";
import { getStoredUTMParams } from "@/hooks/useUTMParams";
import { getRecaptchaToken, loadRecaptcha } from "@/lib/recaptcha";
import { useRouter } from "next/navigation";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface DialogFormProps {
  /** Optional: by default closes the "Let's contact" dialog in the store */
  closeModal?: () => void;
}

const DialogForm = ({ closeModal: closeModalProp }: DialogFormProps) => {
  const setOpenLetsContactDialog = useRCWebStore(
    (state) => state.setOpenLetsContactDialog
  );
  const closeModal = closeModalProp ?? (() => setOpenLetsContactDialog(false));
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formMountTime = useRef<number | null>(null);
  const [honeypot, setHoneypot] = useState("");

  // Se marca al montar (no durante el render) para medir cuánto tardó el usuario
  useEffect(() => {
    formMountTime.current = Date.now();
  }, []);

  // Precarga reCAPTCHA en la primera interacción para que el envío sea rápido
  const handleFormInteraction = () => {
    loadRecaptcha().catch(() => {
      // Si falla aquí, se reintenta al enviar
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      marketingConsent: false,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Anti-Bot Protection Layer 1: Honeypot check
    if (honeypot) {
      console.warn("🚫 Bot detected: Honeypot filled");
      toast.error("Something went wrong. Please try again.");
      return;
    }

    // Anti-Bot Protection Layer 2: Minimum time check (3 seconds)
    const timeSpent = formMountTime.current ? Date.now() - formMountTime.current : 0;
    if (timeSpent < 3000) {
      console.warn("🚫 Bot detected: Form submitted too quickly");
      toast.error("Please take a moment to review your message.");
      return;
    }

    // Anti-Bot Protection Layer 3: reCAPTCHA v3 (el servidor exige el token)
    let recaptchaToken = "";
    try {
      recaptchaToken = await getRecaptchaToken("submit_contact_form");
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      toast.error(
        "We couldn't verify your submission. Please disable ad blockers or refresh and try again."
      );
      return;
    }

    const toastId = toast.loading("Sending message…");

    // Get UTM params from session storage
    const utmData = getStoredUTMParams();

    try {
      startTransition(async () => {
        const contact = await createContactAction(
          data,
          recaptchaToken,
          timeSpent,
          "contact_form",
          utmData || undefined
        );

        if (contact.success) {
          // Track successful contact form submission
          trackContactFormSubmit("homepage_dialog");

          // Track Google Ads conversion with Enhanced Conversions
          trackSubmitLeadForm(data.email, data.phone);

          // Track Facebook Lead conversion
          trackFBLead();

          // Track LinkedIn Lead conversion
          trackLinkedInConversion();

          toast.success(contact.message, { id: toastId });
          reset();
          closeModal();

          // Redirect to thank-you page
          router.push("/thank-you");
        } else {
          const errorMessages = Object.values(contact.errors)
            .flat()
            .join(" • ");
          toast.error(
            errorMessages || contact.message || "Failed to send message",
            { id: toastId }
          );
          console.error(contact.errors);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  return (
    <>
      <div className="relative">
        <form
          onSubmit={(event) => handleSubmit(onSubmit)(event)}
          onFocus={handleFormInteraction}
          className="relative space-y-6 bg-linear-to-br from-gray-900/95 to-gray-800/95 p-8 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-gold/30 transition duration-500"
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl text-gold  text-center font-iceland tracking-wide">
              Let&apos;s Connect
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Honeypot field - hidden from users, visible to bots */}
          <input
            type="text"
            name="address_confirm"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="new-password"
            tabIndex={-1}
            className="absolute left-[-9999px] opacity-0 h-0 w-0 pointer-events-none"
            aria-hidden="true"
          />

          {/** Name Field */}
          <div className="group">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                {...register("name")}
                autoComplete="name"
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                type="text"
                id="name"
                className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer"
                placeholder="Your full name…"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p id="name-error" role="alert" className="text-red-400 text-sm mt-2 font-inter flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {message}
                </p>
              )}
            />
          </div>

          {/** Email Field */}
          <div className="group">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register("email")}
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                type="email"
                id="email"
                className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer"
                placeholder="you@yourbusiness.com…"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p id="email-error" role="alert" className="text-red-400 text-sm mt-2 font-inter flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {message}
                </p>
              )}
            />
          </div>

          {/** Phone Field */}
          <div className="group">
            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                {...register("phone")}
                autoComplete="tel"
                inputMode="tel"
                aria-required="true"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                type="tel"
                id="phone"
                className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer"
                placeholder="(346) 555-0123…"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <ErrorMessage
              errors={errors}
              name="phone"
              render={({ message }) => (
                <p id="phone-error" role="alert" className="text-red-400 text-sm mt-2 font-inter flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {message}
                </p>
              )}
            />
          </div>

          {/** Message Field */}
          <div className="group">
            <div className="relative">
              <label htmlFor="message" className="sr-only">
                Your message
              </label>
              <textarea
                {...register("message")}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                id="message"
                className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer resize-none"
                placeholder="Tell me about your project…"
                rows={5}
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <ErrorMessage
              errors={errors}
              name="message"
              render={({ message }) => (
                <p id="message-error" role="alert" className="text-red-400 text-sm mt-2 font-inter flex items-center">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {message}
                </p>
              )}
            />
          </div>

          {/** Marketing Consent Checkbox */}
          <div className="group">
            <label className="flex items-start space-x-3 cursor-pointer hover:bg-gray-800/30 p-3 rounded-lg transition duration-200">
              <div className="flex items-center h-5 mt-1">
                <input
                  {...register("marketingConsent")}
                  type="checkbox"
                  className="w-5 h-5 bg-gray-800/80 border-2 border-gray-700/60 rounded-sm text-gold focus:ring-2 focus:ring-gold/20 focus:ring-offset-0 focus:ring-offset-gray-900 checked:bg-gold checked:border-gold cursor-pointer transition duration-200 hover:border-gold/50"
                />
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-300 font-inter leading-relaxed">
                  I would like to receive promotional and informational emails
                  and SMS messages from RC Web Solutions LLC about its services.
                  <span className="text-gray-400 block mt-1 text-xs">
                    Message frequency may vary. Message & data rates may apply.
                    Reply STOP to opt-out. Consent is not a condition of
                    purchase or service. You can unsubscribe at any time.
                  </span>
                </span>
              </div>
            </label>
          </div>

          {/** Submit Button */}
          <div className="pt-2">
            <Button type="submit" size="lg" fullWidth disabled={isPending}>
              {isPending ? "Sending…" : "Send Message"}
              <PaperAirplaneIcon
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>

            {/* reCAPTCHA disclosure (required when hiding badge) */}
            <div className="flex justify-center mt-3">
              <p className="text-white/50 font-inter text-xs text-center leading-relaxed max-w-md">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 hover:text-gold transition-colors underline"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 hover:text-gold transition-colors underline"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DialogForm;
