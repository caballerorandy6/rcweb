"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import Heading from "@/app/components/ui/Heading";
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { trackFBPhoneCall } from "@/app/components/tracking/FacebookPixel";

// Phone Conversion Tracking (Google Ads + Facebook)
const trackPhoneConversion = () => {
  // Google Ads conversion
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-17661176254/wW9-CKCVjLAbEL7TwOVB",
      value: 1.0,
      currency: "USD",
    });
  }

  // Facebook Pixel conversion
  trackFBPhoneCall();
};

export default function PrivacyPolicy() {
  const router = useRouter();
  const ref = useSectionObserver({ sectionName: "Privacy Policy" });

  const handleGoBack = () => {
    router.back();
  };

  return (
    <section
      id="privacy"
      ref={ref}
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Botón de regresar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="mb-8 max-w-5xl mx-auto flex justify-end"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600 font-inter"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </motion.button>
        </motion.div>

        <Heading
          icon={<ShieldCheckIcon className="w-8 text-gold" />}
          text="Your Privacy Matters"
        >
          Privacy Policy
        </Heading>

        {/* Introduction Card */}
        <motion.div
          className="mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <p className="text-white/90 text-lg leading-relaxed font-inter">
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </p>
            <p className="mt-4 text-white/90 text-lg leading-relaxed font-inter">
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy.
            </p>
            <div className="mt-4 flex items-center gap-2 text-gold/70 text-sm">
              <InformationCircleIcon className="w-5 h-5" />
              <span className="font-inter">Last updated: October 21, 2025</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="prose prose-invert prose-gold max-w-none">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8 space-y-8">
              {/* Interpretation and Definitions */}
              <section>
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Interpretation and Definitions
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Interpretation
                </h3>
                <p className="text-white/80 leading-relaxed font-inter">
                  The words whose initial letters are capitalized have meanings
                  defined under the following conditions. The following
                  definitions shall have the same meaning regardless of whether
                  they appear in singular or in plural.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Definitions
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  For the purposes of this Privacy Policy:
                </p>

                <ul className="space-y-3 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">Account</strong> means a
                    unique account created for You to access our Service or
                    parts of our Service.
                  </li>
                  <li>
                    <strong className="text-gold">Affiliate</strong> means an
                    entity that controls, is controlled by, or is under common
                    control with a party, where &ldquo;control&rdquo; means
                    ownership of 50% or more of the shares, equity interest or
                    other securities entitled to vote for election of directors
                    or other managing authority.
                  </li>
                  <li>
                    <strong className="text-gold">Business</strong>, for the
                    purpose of CCPA/CPRA, refers to the Company as the legal
                    entity that collects Consumers&apos; personal information
                    and determines the purposes and means of the processing of
                    Consumers&apos; personal information.
                  </li>
                  <li>
                    <strong className="text-gold">CCPA and/or CPRA</strong>{" "}
                    refers to the California Consumer Privacy Act (the
                    &ldquo;CCPA&rdquo;) as amended by the California Privacy
                    Rights Act of 2020 (the &ldquo;CPRA&rdquo;).
                  </li>
                  <li>
                    <strong className="text-gold">Company</strong> (referred to
                    as either &ldquo;the Company&rdquo;, &ldquo;We&rdquo;,
                    &ldquo;Us&rdquo; or &ldquo;Our&rdquo; in this Agreement)
                    refers to RC Web Solutions LLC, 6210 Newquay St Houston, TX
                    77085. For the purposes of the GDPR, the Company is the Data
                    Controller.
                  </li>
                  <li>
                    <strong className="text-gold">Consumer</strong>, for the
                    purpose of the CCPA/CPRA, means a natural person who is a
                    California resident.
                  </li>
                  <li>
                    <strong className="text-gold">Cookies</strong> are small
                    files that are placed on Your computer, mobile device or any
                    other device by a website, containing the details of Your
                    browsing history on that website among its many uses.
                  </li>
                  <li>
                    <strong className="text-gold">Country</strong> refers to:
                    Texas, United States
                  </li>
                  <li>
                    <strong className="text-gold">Data Controller</strong>, for
                    the purposes of the GDPR (General Data Protection
                    Regulation), refers to the Company as the legal person which
                    alone or jointly with others determines the purposes and
                    means of the processing of Personal Data.
                  </li>
                  <li>
                    <strong className="text-gold">Device</strong> means any
                    device that can access the Service such as a computer, a
                    cell phone or a digital tablet.
                  </li>
                  <li>
                    <strong className="text-gold">Do Not Track (DNT)</strong> is
                    a concept that has been promoted by US regulatory
                    authorities for the Internet industry to develop and
                    implement a mechanism for allowing internet users to control
                    the tracking of their online activities across websites.
                  </li>
                  <li>
                    <strong className="text-gold">GDPR</strong> refers to EU
                    General Data Protection Regulation.
                  </li>
                  <li>
                    <strong className="text-gold">Personal Data</strong> is any
                    information that relates to an identified or identifiable
                    individual.
                  </li>
                  <li>
                    <strong className="text-gold">Service</strong> refers to the
                    Website.
                  </li>
                  <li>
                    <strong className="text-gold">Service Provider</strong>{" "}
                    means any natural or legal person who processes the data on
                    behalf of the Company.
                  </li>
                  <li>
                    <strong className="text-gold">SMS Marketing</strong> refers
                    to text message communications sent to Your mobile device
                    for marketing, promotional, transactional, or informational
                    purposes.
                  </li>
                  <li>
                    <strong className="text-gold">Usage Data</strong> refers to
                    data collected automatically, either generated by the use of
                    the Service or from the Service infrastructure itself.
                  </li>
                  <li>
                    <strong className="text-gold">Website</strong> refers to RC
                    Web, accessible from rcweb.dev
                  </li>
                  <li>
                    <strong className="text-gold">You</strong> means the
                    individual accessing or using the Service, or the company,
                    or other legal entity on behalf of which such individual is
                    accessing or using the Service, as applicable.
                  </li>
                </ul>
              </section>

              {/* Collecting and Using Your Personal Data */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Collecting and Using Your Personal Data
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Types of Data Collected
                </h3>

                <h4 className="text-lg font-semibold text-gold/80 font-iceland mt-4 mb-2">
                  Personal Data
                </h4>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  While using Our Service, We may ask You to provide Us with
                  certain personally identifiable information that can be used
                  to contact or identify You. Personally identifiable
                  information may include, but is not limited to:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Physical address</li>
                  <li>
                    Bank account information in order to pay for products and/or
                    services within the Service
                  </li>
                  <li>Usage Data</li>
                </ul>

                <h4 className="text-lg font-semibold text-gold/80 font-iceland mt-4 mb-2">
                  Usage Data
                </h4>
                <p className="text-white/80 leading-relaxed font-inter">
                  Usage Data is collected automatically when using the Service.
                  Usage Data may include information such as Your Device&apos;s
                  Internet Protocol address (e.g. IP address), browser type,
                  browser version, the pages of our Service that You visit, the
                  time and date of Your visit, the time spent on those pages,
                  unique device identifiers and other diagnostic data.
                </p>

                <h4 className="text-lg font-semibold text-gold/80 font-iceland mt-6 mb-2">
                  SMS and Text Messaging Data
                </h4>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  When You opt-in to receive SMS communications from Us, We
                  collect and process:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Your mobile phone number</li>
                  <li>Your consent records and opt-in date/time</li>
                  <li>Message delivery status and timestamps</li>
                  <li>
                    Your responses to our messages (including STOP, HELP, and
                    other keywords)
                  </li>
                  <li>
                    Device and carrier information related to message delivery
                  </li>
                </ul>
              </section>

              {/* SMS Marketing Section */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  SMS Marketing and Text Message Communications
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  How We Use SMS Marketing
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  We may use SMS (text messaging) to communicate with You for
                  various purposes, including but not limited to:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>
                    Marketing and promotional messages about our services and
                    special offers
                  </li>
                  <li>
                    Transactional messages related to your account or services
                  </li>
                  <li>Appointment reminders and confirmations</li>
                  <li>Service updates and notifications</li>
                  <li>Customer support and responses to your inquiries</li>
                  <li>
                    Delivery of requested information (such as guides or
                    resources)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Your Consent to Receive SMS Messages
                </h3>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
                  <p className="text-white/90 font-semibold font-inter">
                    By providing Your mobile phone number and opting in to
                    receive text messages from RC Web Solutions LLC, You
                    expressly consent to receive recurring automated marketing
                    and informational text messages from us at the phone number
                    You provided. Consent is not a condition of purchase.
                  </p>
                </div>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  You may opt-in to SMS communications by:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Texting a keyword to our short code or phone number</li>
                  <li>Checking a consent box on our website or forms</li>
                  <li>
                    Verbally providing consent during customer service
                    interactions
                  </li>
                  <li>Enrolling during account creation or service setup</li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Message Frequency and Charges
                </h3>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">Message Frequency:</strong>{" "}
                    The frequency of messages varies depending on your
                    interaction with our services. You may receive up to 4
                    marketing messages per month. Transactional and
                    service-related messages are sent as needed.
                  </li>
                  <li>
                    <strong className="text-gold">
                      Message and Data Rates:
                    </strong>{" "}
                    Message and data rates may apply depending on your mobile
                    carrier plan. Please check with your mobile carrier for
                    details on your plan.
                  </li>
                  <li>
                    <strong className="text-gold">Carrier Limitations:</strong>{" "}
                    Messages are sent via supported carriers. Not all carriers
                    are supported. Check with your carrier for availability.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  How to Opt-Out
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  You can opt-out of receiving SMS messages at any time by:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-3">
                  <li>
                    <strong className="text-gold">
                      Texting &ldquo;STOP&rdquo;
                    </strong>{" "}
                    to any message you receive from us
                  </li>
                  <li>Texting &ldquo;UNSUBSCRIBE&rdquo; to our number</li>
                  <li>Replying &ldquo;STOP&rdquo; to +1 346-375-7534</li>
                  <li>Contacting us via email at contactus@rcweb.dev</li>
                  <li>Calling us at +1 346-375-7534</li>
                </ul>
                <p className="text-white/80 leading-relaxed font-inter">
                  After you opt-out, you will receive one final confirmation
                  message. You will not receive any further messages unless you
                  opt back in.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Help and Support
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  For help or more information about our SMS program, you can:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">
                      Text &ldquo;HELP&rdquo;
                    </strong>{" "}
                    to any message from us
                  </li>
                  <li>Contact us at contactus@rcweb.dev</li>
                  <li>Call us at +1 346-375-7534</li>
                  <li>Visit our website at rcweb.dev</li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  SMS Privacy and Data Security
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  We take the privacy and security of your phone number and SMS
                  data seriously:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Your phone number will not be shared with third parties for
                    their marketing purposes
                  </li>
                  <li>
                    We use secure systems to transmit and store your phone
                    number
                  </li>
                  <li>
                    We work with reputable SMS service providers (including
                    Twilio) who comply with industry standards
                  </li>
                  <li>
                    Your SMS data is subject to the same privacy protections as
                    other Personal Data described in this policy
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Compliance
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Our SMS marketing practices comply with:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Telephone Consumer Protection Act (TCPA)</li>
                  <li>CAN-SPAM Act</li>
                  <li>CTIA Guidelines</li>
                  <li>Mobile Marketing Association (MMA) Guidelines</li>
                  <li>Federal Communications Commission (FCC) regulations</li>
                  <li>State-specific regulations including CCPA/CPRA</li>
                </ul>
              </section>

              {/* Subscription Data */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Subscription and Payment Data
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  When You subscribe to Our services, We collect and store the
                  following information:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>Your name and email address</li>
                  <li>Subscription plan details and billing cycle</li>
                  <li>Payment history and invoice records</li>
                  <li>Subscription status (active, cancelled, past due)</li>
                </ul>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  <strong className="text-gold">Important:</strong> We do not
                  store your full credit card number. All payment processing is
                  handled securely by Stripe, which stores your payment details
                  in compliance with PCI-DSS standards.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Stripe Customer Portal
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  We use the Stripe Customer Portal to allow You to manage Your
                  subscription. Through the portal, You can:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>Update Your payment method</li>
                  <li>View billing history and download invoices</li>
                  <li>Cancel Your subscription</li>
                </ul>
                <p className="text-white/80 leading-relaxed font-inter">
                  You can access the Customer Portal at any time by visiting{" "}
                  <Link
                    href={"/manage-subscription" as Route}
                    className="text-gold hover:text-gold/80 underline"
                  >
                    rcweb.dev/manage-subscription
                  </Link>
                  .
                </p>
              </section>

              {/* Use of Your Personal Data */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Use of Your Personal Data
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  The Company may use Personal Data for the following purposes:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">
                      To provide and maintain our Service
                    </strong>
                    , including to monitor the usage of our Service.
                  </li>
                  <li>
                    <strong className="text-gold">
                      To manage Your Account
                    </strong>
                    : to manage Your registration as a user of the Service.
                  </li>
                  <li>
                    <strong className="text-gold">
                      For the performance of a contract
                    </strong>
                    : the development, compliance and undertaking of the
                    purchase contract for the products, items or services You
                    have purchased.
                  </li>
                  <li>
                    <strong className="text-gold">To contact You</strong>: To
                    contact You by email, telephone calls, SMS, or other
                    equivalent forms of electronic communication.
                  </li>
                  <li>
                    <strong className="text-gold">To provide You</strong> with
                    news, special offers, and general information about other
                    goods, services and events which We offer.
                  </li>
                  <li>
                    <strong className="text-gold">
                      To manage Your requests
                    </strong>
                    : To attend and manage Your requests to Us.
                  </li>
                  <li>
                    <strong className="text-gold">
                      For business transfers
                    </strong>
                    : We may use Your information to evaluate or conduct a
                    merger, divestiture, restructuring, reorganization,
                    dissolution, or other sale or transfer of some or all of Our
                    assets.
                  </li>
                </ul>
              </section>

              {/* Service Providers */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Service Providers
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Analytics
                </h3>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gold/80 font-iceland mb-2">
                    Google Analytics
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    Google Analytics is a web analytics service offered by
                    Google that tracks and reports website traffic. For more
                    information on the privacy practices of Google, please
                    visit:{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Email Marketing
                </h3>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gold/80 font-iceland mb-2">
                    Resend
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter">
                    Their Privacy Policy can be viewed at:{" "}
                    <a
                      href="https://resend.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://resend.com/legal/privacy-policy
                    </a>
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  SMS Service Providers
                </h3>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gold/80 font-iceland mb-2">
                    Twilio
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    We use Twilio as our SMS service provider to send you text
                    messages. Twilio&apos;s services are subject to their
                    privacy policy and terms of service.
                  </p>
                  <p className="text-white/80 leading-relaxed font-inter">
                    Twilio Privacy Policy:{" "}
                    <a
                      href="https://www.twilio.com/legal/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://www.twilio.com/legal/privacy
                    </a>
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Payments
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gold/80 font-iceland mb-2">
                      Stripe
                    </h4>
                    <p className="text-white/80 leading-relaxed font-inter">
                      Their Privacy Policy can be viewed at:{" "}
                      <a
                        href="https://stripe.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold/80 underline"
                      >
                        https://stripe.com/privacy
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gold/80 font-iceland mb-2">
                      Zelle
                    </h4>
                    <p className="text-white/80 leading-relaxed font-inter">
                      Their Privacy Policy can be viewed at:{" "}
                      <a
                        href="https://www.zellepay.com/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold/80 underline"
                      >
                        https://www.zellepay.com/privacy-policy
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* GDPR Privacy */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  GDPR Privacy
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Your Rights under the GDPR
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  You have the right under this Privacy Policy, and by law if
                  You are within the EU, to:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">
                      Request access to Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong className="text-gold">
                      Request correction of the Personal Data that We hold about
                      You
                    </strong>
                  </li>
                  <li>
                    <strong className="text-gold">
                      Object to processing of Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong className="text-gold">
                      Request erasure of Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong className="text-gold">
                      Request the transfer of Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong className="text-gold">Withdraw Your consent</strong>
                  </li>
                </ul>
              </section>

              {/* CCPA/CPRA Privacy */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  CCPA/CPRA Privacy Notice
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  This privacy notice section for California residents
                  supplements the information contained in Our Privacy Policy
                  and it applies solely to all visitors, users, and others who
                  reside in the State of California.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  Your Rights under the CCPA/CPRA
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  The CCPA/CPRA provides California residents with specific
                  rights regarding their personal information. If You are a
                  resident of California, You have the following rights:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>The right to notice</li>
                  <li>The right to know/access</li>
                  <li>
                    The right to say no to the sale or sharing of Personal Data
                    (opt-out)
                  </li>
                  <li>The right to correct Personal Data</li>
                  <li>
                    The right to limit use and disclosure of sensitive Personal
                    Data
                  </li>
                  <li>The right to delete Personal Data</li>
                  <li>The right not to be discriminated against</li>
                </ul>
              </section>

              {/* Children's Privacy */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Our Service does not address anyone under the age of 13. We do
                  not knowingly collect personally identifiable information from
                  anyone under the age of 13. If You are a parent or guardian
                  and You are aware that Your child has provided Us with
                  Personal Data, please contact Us.
                </p>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-white/90 font-semibold font-inter">
                    We do not send SMS marketing messages to anyone under the
                    age of 18.
                  </p>
                </div>
              </section>

              {/* Changes to Policy */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Changes to this Privacy Policy
                </h2>
                <p className="text-white/80 leading-relaxed font-inter">
                  We may update Our Privacy Policy from time to time. We will
                  notify You of any changes by posting the new Privacy Policy on
                  this page. We will let You know via email and/or a prominent
                  notice on Our Service, prior to the change becoming effective
                  and update the &ldquo;Last updated&rdquo; date at the top of
                  this Privacy Policy.
                </p>
              </section>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-transparent backdrop-blur-md rounded-xl border border-gold/20 p-8">
            <h2 className="text-2xl font-bold text-gold font-iceland mb-6">
              Contact Us
            </h2>
            <p className="text-white/80 font-inter mb-6">
              If you have any questions about this Privacy Policy, including our
              SMS marketing practices, You can contact us:
            </p>

            <div className="space-y-4 font-inter">
              <a
                href="mailto:contactus@rcweb.dev"
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors group"
              >
                <EnvelopeIcon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold">By email:</div>
                  <div className="text-sm">contactus@rcweb.dev</div>
                </div>
              </a>

              <a
                href="tel:+13463757534"
                onClick={trackPhoneConversion}
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors group"
              >
                <PhoneIcon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold">By phone:</div>
                  <div className="text-sm">+1 346-375-7534</div>
                </div>
              </a>

              <div className="pt-4 border-t border-gold/20">
                <p className="text-gold font-semibold mb-2">
                  For SMS-related inquiries:
                </p>
                <ul className="space-y-2 text-white/80 text-sm list-disc list-inside">
                  <li>Text &ldquo;HELP&rdquo; to any message from us</li>
                  <li>Reply to +1 346-375-7534</li>
                  <li>Email: contactus@rcweb.dev</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gold/20">
                <p className="text-gold font-semibold mb-2">
                  To opt-out of SMS messages:
                </p>
                <ul className="space-y-2 text-white/80 text-sm list-disc list-inside">
                  <li>Text &ldquo;STOP&rdquo; to any message from us</li>
                  <li>Reply &ldquo;STOP&rdquo; to +1 346-375-7534</li>
                </ul>
              </div>

              <div className="pt-4 text-sm text-white/60">
                <p>
                  <strong className="text-gold">RC Web Solutions LLC</strong>
                </p>
                <p>6210 Newquay St, Houston, TX 77085</p>
                <p className="mt-2">
                  <a
                    href="https://rcweb.dev"
                    className="text-gold hover:text-gold/80 transition-colors"
                  >
                    rcweb.dev
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center flex justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
        >
          <p className="text-white/50 text-sm font-inter">
            For GDPR purposes, RC Web Solutions LLC is the Data Controller
          </p>
        </motion.div>
      </div>
    </section>
  );
}
