import { useTransition, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { FormSchema, FormData } from "@/lib/zod";
import { toast } from "sonner";
import { createContactAction } from "@/actions/createContactAction";
import { trackContactFormSubmit } from "@/lib/analytics";
import { trackFBLead } from "@/app/components/FacebookPixel";
import Script from "next/script";

// Extend Window interface for gtag and grecaptcha
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

interface DialogFormProps {
  closeModal: () => void;
}

const DialogForm = ({ closeModal }: DialogFormProps) => {
  const [isPending, startTransition] = useTransition();
  const formMountTime = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState("");

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
    const timeSpent = Date.now() - formMountTime.current;
    if (timeSpent < 3000) {
      console.warn("🚫 Bot detected: Form submitted too quickly");
      toast.error("Please take a moment to review your message.");
      return;
    }

    // Anti-Bot Protection Layer 3: reCAPTCHA v3
    let recaptchaToken = "";
    if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
      try {
        recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action: "submit_contact_form",
        });
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        toast.error("Verification failed. Please refresh and try again.");
        return;
      }
    }

    // Mostrar toast de carga y guardar su ID
    const toastId = toast.loading("Sending message...");

    try {
      startTransition(async () => {
        const contact = await createContactAction(data, recaptchaToken, timeSpent);

        if (contact.success) {
          // Track successful contact form submission
          trackContactFormSubmit("homepage_dialog");

          // Track Google Ads conversion with Enhanced Conversions
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "conversion_event_submit_lead_form", {
              email: data.email,
              phone_number: data.phone,
            });
          }

          // Track Facebook Lead conversion
          trackFBLead();

          toast.success(contact.message, { id: toastId });
          reset();
          closeModal();
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
      {/* Load reCAPTCHA v3 */}
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 rounded-2xl blur-xl"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative space-y-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 hover:border-gold/30 transition-all duration-500"
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl text-gold  font-bold text-center font-iceland tracking-wide">
              Let&apos;s Connect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Honeypot field - hidden from users, visible to bots */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
            aria-hidden="true"
          />

        {/** Name Field */}
        <div className="group">
          <div className="relative">
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
              placeholder="Full Name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Email Field */}
        <div className="group">
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
              placeholder="Email"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Phone Field */}
        <div className="group">
          <div className="relative">
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
              placeholder="Phone Number"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="phone"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Message Field */}
        <div className="group">
          <div className="relative">
            <textarea
              {...register("message")}
              id="message"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm resize-none"
              placeholder="Type your message..."
              rows={5}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="message"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Marketing Consent Checkbox */}
        <div className="group">
          <label className="flex items-start space-x-3 cursor-pointer hover:bg-gray-800/30 p-3 rounded-lg transition-all duration-200">
            <div className="flex items-center h-5 mt-1">
              <input
                {...register("marketingConsent")}
                type="checkbox"
                className="w-5 h-5 bg-gray-800/80 border-2 border-gray-700/60 rounded text-gold focus:ring-2 focus:ring-gold/20 focus:ring-offset-0 focus:ring-offset-gray-900 checked:bg-gold checked:border-gold cursor-pointer transition-all duration-200 hover:border-gold/50"
              />
            </div>
            <div className="flex-1">
              <span className="text-sm text-gray-300 font-inter leading-relaxed">
                I would like to receive promotional emails and SMS messages from RC Web Solutions LLC about services, updates, and special offers.
                <span className="text-gray-500 block mt-1 text-xs">
                  Message & data rates may apply. Reply STOP to opt-out. Consent is not a condition of purchase or service. You can unsubscribe at any time.
                </span>
              </span>
            </div>
          </label>
        </div>

        {/** Submit Button */}
        <div className="pt-2">
          <button
            disabled={isPending}
            type="submit"
            className="relative w-full py-4 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative flex items-center justify-center">
              {isPending ? <p>Sending...</p> : <p>Send Message</p>}
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default DialogForm;
