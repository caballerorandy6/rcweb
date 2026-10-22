import Link from "next/link";
import type { Route } from "next";
import Heading from "@/components/ui/Heading";
import BackButton from "@/components/ui/BackButton";
import PhoneLink from "@/components/tracking/PhoneLink";
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import CookieSettingsButton from "@/components/forms/CookieSettingsButton";
import { COMPANY, COMPANY_ADDRESS, LEGAL_LAST_UPDATED } from "@/lib/company";

export default function PrivacyPolicy() {
  return (
    <section
      id="privacy"
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-linear-to-b from-gray-900 via-gray-900/95 to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Botón de regresar */}
        <div className="mb-8 max-w-5xl mx-auto flex justify-end animate-enter">
          <BackButton />
        </div>

        <Heading
          as="h1"
          icon={<ShieldCheckIcon className="w-8 text-gold" />}
          text="Your Privacy Matters"
        >
          Privacy Policy
        </Heading>

        {/* Introduction Card */}
        <div className="mt-16 max-w-5xl mx-auto reveal">
          <div className="bg-linear-to-r from-gold/10 to-gold/5 rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
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
              <span className="font-inter">Last updated: {LEGAL_LAST_UPDATED.label}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-12 max-w-5xl mx-auto reveal">
          <div className="legal-prose max-w-none">
            <div className="bg-gray-900/60 rounded-2xl border border-gold/20 p-8 space-y-8">
              {/* Interpretation and Definitions */}
              <section>
                <h2>
                  Interpretation and Definitions
                </h2>

                <h3>
                  Interpretation
                </h3>
                <p>
                  The words whose initial letters are capitalized have meanings
                  defined under the following conditions. The following
                  definitions shall have the same meaning regardless of whether
                  they appear in singular or in plural.
                </p>

                <h3>
                  Definitions
                </h3>
                <p>
                  For the purposes of this Privacy Policy:
                </p>

                <ul>
                  <li>
                    <strong>Access Link</strong> means the
                    private, token-based link We email You to follow Your
                    project or pay an invoice. The Service has no client
                    accounts or passwords.
                  </li>
                  <li>
                    <strong>Affiliate</strong> means an
                    entity that controls, is controlled by, or is under common
                    control with a party, where &ldquo;control&rdquo; means
                    ownership of 50% or more of the shares, equity interest or
                    other securities entitled to vote for election of directors
                    or other managing authority.
                  </li>
                  <li>
                    <strong>Business</strong>, for the
                    purpose of CCPA/CPRA, refers to the Company as the legal
                    entity that collects Consumers&apos; personal information
                    and determines the purposes and means of the processing of
                    Consumers&apos; personal information.
                  </li>
                  <li>
                    <strong>CCPA and/or CPRA</strong>{" "}
                    refers to the California Consumer Privacy Act (the
                    &ldquo;CCPA&rdquo;) as amended by the California Privacy
                    Rights Act of 2020 (the &ldquo;CPRA&rdquo;).
                  </li>
                  <li>
                    <strong>Company</strong> (referred to
                    as either &ldquo;the Company&rdquo;, &ldquo;We&rdquo;,
                    &ldquo;Us&rdquo; or &ldquo;Our&rdquo; in this Agreement)
                    refers to {COMPANY.name}, {COMPANY_ADDRESS}. For the
                    purposes of the GDPR, the Company is the Data Controller.
                  </li>
                  <li>
                    <strong>Consumer</strong>, for the
                    purpose of the CCPA/CPRA, means a natural person who is a
                    California resident.
                  </li>
                  <li>
                    <strong>Cookies</strong> are small
                    files that are placed on Your computer, mobile device or any
                    other device by a website, containing the details of Your
                    browsing history on that website among its many uses.
                  </li>
                  <li>
                    <strong>Country</strong> refers to:
                    United States (State of Texas)
                  </li>
                  <li>
                    <strong>Data Controller</strong>, for
                    the purposes of the GDPR (General Data Protection
                    Regulation), refers to the Company as the legal person which
                    alone or jointly with others determines the purposes and
                    means of the processing of Personal Data.
                  </li>
                  <li>
                    <strong>Device</strong> means any
                    device that can access the Service such as a computer, a
                    cell phone or a digital tablet.
                  </li>
                  <li>
                    <strong>Do Not Track (DNT)</strong> is
                    a concept that has been promoted by US regulatory
                    authorities for the Internet industry to develop and
                    implement a mechanism for allowing internet users to control
                    the tracking of their online activities across websites.
                  </li>
                  <li>
                    <strong>GDPR</strong> refers to EU
                    General Data Protection Regulation.
                  </li>
                  <li>
                    <strong>Personal Data</strong> is any
                    information that relates to an identified or identifiable
                    individual.
                  </li>
                  <li>
                    <strong>Service</strong> refers to the
                    Website.
                  </li>
                  <li>
                    <strong>Service Provider</strong>{" "}
                    means any natural or legal person who processes the data on
                    behalf of the Company.
                  </li>
                  <li>
                    <strong>SMS Marketing</strong> refers
                    to text message communications sent to Your mobile device
                    for marketing, promotional, transactional, or informational
                    purposes.
                  </li>
                  <li>
                    <strong>Usage Data</strong> refers to
                    data collected automatically, either generated by the use of
                    the Service or from the Service infrastructure itself.
                  </li>
                  <li>
                    <strong>Website</strong> refers to RC
                    Web, accessible from rcweb.dev
                  </li>
                  <li>
                    <strong>You</strong> means the
                    individual accessing or using the Service, or the company,
                    or other legal entity on behalf of which such individual is
                    accessing or using the Service, as applicable.
                  </li>
                </ul>
              </section>

              {/* Collecting and Using Your Personal Data */}
              <section>
                <h2>
                  Collecting and Using Your Personal Data
                </h2>

                <h3>
                  Types of Data Collected
                </h3>

                <h4 className="text-lg text-gold/80 font-inter font-semibold mt-4 mb-2">
                  Personal Data
                </h4>
                <p>
                  While using Our Service, We may ask You to provide Us with
                  certain personally identifiable information that can be used
                  to contact or identify You. Personally identifiable
                  information may include, but is not limited to:
                </p>
                <ul>
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Physical address</li>
                  <li>
                    Payment details: card payments are processed by Stripe, which
                    never shares Your full card number with Us; Zelle transfers
                    are handled by Your bank
                  </li>
                  <li>Usage Data</li>
                </ul>

                <h4 className="text-lg text-gold/80 font-inter font-semibold mt-4 mb-2">
                  Usage Data
                </h4>
                <p>
                  Usage Data is collected automatically when using the Service.
                  Usage Data may include information such as Your Device&apos;s
                  Internet Protocol address (e.g. IP address), browser type,
                  browser version, the pages of our Service that You visit, the
                  time and date of Your visit, the time spent on those pages,
                  unique device identifiers and other diagnostic data.
                </p>

                <h4 className="text-lg text-gold/80 font-inter font-semibold mt-6 mb-2">
                  SMS and Text Messaging Data
                </h4>
                <p>
                  When You opt-in to receive SMS communications from Us, We
                  collect and process:
                </p>
                <ul>
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
              <section>
                <h2>
                  SMS Marketing and Text Message Communications
                </h2>

                <h3>
                  How We Use SMS Marketing
                </h3>
                <p>
                  We may use SMS (text messaging) to communicate with You for
                  various purposes, including but not limited to:
                </p>
                <ul>
                  <li>
                    Promotional and informational messages about our services
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

                <h3>
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
                <p>
                  You may opt-in to SMS communications by:
                </p>
                <ul>
                  <li>Texting a keyword to our business phone number (+1 346-375-7534)</li>
                  <li>Checking a consent box on our website or forms</li>
                  <li>
                    Verbally providing consent during customer service
                    interactions
                  </li>
                  <li>Opting in when You hire Us or set up a service</li>
                </ul>

                <h3>
                  Message Frequency and Charges
                </h3>
                <ul>
                  <li>
                    <strong>Message Frequency:</strong>{" "}
                    The frequency of messages varies depending on your
                    interaction with our services. You may receive up to 4
                    marketing messages per month. Transactional and
                    service-related messages are sent as needed.
                  </li>
                  <li>
                    <strong>
                      Message and Data Rates:
                    </strong>{" "}
                    Message and data rates may apply depending on your mobile
                    carrier plan. Please check with your mobile carrier for
                    details on your plan.
                  </li>
                  <li>
                    <strong>Carrier Limitations:</strong>{" "}
                    Messages are sent via supported carriers. Not all carriers
                    are supported. Check with your carrier for availability.
                  </li>
                </ul>

                <h3>
                  How to Opt-Out
                </h3>
                <p>
                  You can opt-out of receiving SMS messages at any time by:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-3">
                  <li>
                    <strong>
                      Texting &ldquo;STOP&rdquo;
                    </strong>{" "}
                    to any message you receive from us
                  </li>
                  <li>Texting &ldquo;UNSUBSCRIBE&rdquo; to our number</li>
                  <li>Replying &ldquo;STOP&rdquo; to +1 346-375-7534</li>
                  <li>Contacting us via email at contactus@rcweb.dev</li>
                  <li>Calling us at +1 346-375-7534</li>
                </ul>
                <p>
                  After you opt-out, you will receive one final confirmation
                  message. You will not receive any further messages unless you
                  opt back in.
                </p>

                <h3>
                  Help and Support
                </h3>
                <p>
                  For help or more information about our SMS program, you can:
                </p>
                <ul>
                  <li>
                    <strong>
                      Text &ldquo;HELP&rdquo;
                    </strong>{" "}
                    to any message from us
                  </li>
                  <li>Contact us at contactus@rcweb.dev</li>
                  <li>Call us at +1 346-375-7534</li>
                  <li>Visit our website at rcweb.dev</li>
                </ul>

                <h3>
                  SMS Privacy and Data Security
                </h3>
                <p>
                  We take the privacy and security of your phone number and SMS
                  data seriously:
                </p>
                <ul>
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

                <h3>
                  Compliance
                </h3>
                <p>
                  Our SMS marketing practices comply with:
                </p>
                <ul>
                  <li>Telephone Consumer Protection Act (TCPA)</li>
                  <li>CAN-SPAM Act</li>
                  <li>CTIA Guidelines</li>
                  <li>Mobile Marketing Association (MMA) Guidelines</li>
                  <li>Federal Communications Commission (FCC) regulations</li>
                  <li>State-specific regulations including CCPA/CPRA</li>
                </ul>
              </section>

              {/* Project Data */}
              <section>
                <h2>
                  Project Data
                </h2>
                <p>
                  When You hire Us, We collect and store the information needed
                  to deliver and document Your project:
                </p>
                <ul>
                  <li>Your name, email address and the plan You purchased</li>
                  <li>Project information and milestone status</li>
                  <li>Payment history and invoice records</li>
                  <li>Your acceptance of our Terms of Service</li>
                </ul>
                <p>
                  You can follow Your project&apos;s progress through a private link
                  We send You by email; no account or password is required. This
                  data is used solely to provide You with project visibility and
                  maintain accurate records of our business relationship.
                </p>
              </section>

              {/* AI Tools Disclosure */}
              <section>
                <h2>
                  AI Tools and Development Assistance
                </h2>
                <p>
                  RC Web Solutions LLC may use artificial intelligence tools to
                  enhance our development process and service delivery:
                </p>
                <ul>
                  <li>
                    <strong>Code Development:</strong>{" "}
                    AI assistants may be used to help write, review, and optimize code
                  </li>
                  <li>
                    <strong>Content Generation:</strong>{" "}
                    AI may assist in drafting documentation, emails, or initial content
                  </li>
                  <li>
                    <strong>Customer Support:</strong>{" "}
                    the chat assistant on this website generates its replies
                    with OpenAI (see Service Providers below)
                  </li>
                </ul>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
                  <p className="text-white/90 font-semibold font-inter">
                    Important: We do NOT share your personal data, proprietary business
                    information, or confidential project details with AI training datasets.
                  </p>
                </div>
                <p>
                  All AI-generated content is reviewed and approved by our human team
                  before delivery. The use of AI tools does not affect our commitment
                  to quality, security, and confidentiality of your project.
                </p>
              </section>

              {/* Subscription Data */}
              <section>
                <h2>
                  Subscription and Payment Data
                </h2>
                <p>
                  When You subscribe to Our services, We collect and store the
                  following information:
                </p>
                <ul>
                  <li>Your name and email address</li>
                  <li>Subscription plan details and billing cycle</li>
                  <li>Payment history and invoice records</li>
                  <li>Subscription status (active, cancelled, past due)</li>
                </ul>
                <p>
                  <strong>Important:</strong> We do not
                  store your full credit card number. All payment processing is
                  handled securely by Stripe, which stores your payment details
                  in compliance with PCI-DSS standards.
                </p>

                <h3>
                  Stripe Customer Portal
                </h3>
                <p>
                  We use the Stripe Customer Portal to allow You to manage Your
                  subscription. Through the portal, You can:
                </p>
                <ul>
                  <li>Update Your payment method</li>
                  <li>View billing history and download invoices</li>
                  <li>Cancel Your subscription</li>
                </ul>
                <p>
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
              <section>
                <h2>
                  Use of Your Personal Data
                </h2>
                <p>
                  The Company may use Personal Data for the following purposes:
                </p>
                <ul>
                  <li>
                    <strong>
                      To provide and maintain our Service
                    </strong>
                    , including to monitor the usage of our Service.
                  </li>
                  <li>
                    <strong>
                      To deliver Your project
                    </strong>
                    : to send You the private Access Links for Your project
                    status, invoices and payments.
                  </li>
                  <li>
                    <strong>
                      For the performance of a contract
                    </strong>
                    : the development, compliance and undertaking of the
                    purchase contract for the products, items or services You
                    have purchased.
                  </li>
                  <li>
                    <strong>To contact You</strong>: To
                    contact You by email, telephone calls, SMS, or other
                    equivalent forms of electronic communication.
                  </li>
                  <li>
                    <strong>To provide You</strong> with
                    news and general information about the services which We
                    offer.
                  </li>
                  <li>
                    <strong>
                      To manage Your requests
                    </strong>
                    : To attend and manage Your requests to Us.
                  </li>
                  <li>
                    <strong>
                      For business transfers
                    </strong>
                    : We may use Your information to evaluate or conduct a
                    merger, divestiture, restructuring, reorganization,
                    dissolution, or other sale or transfer of some or all of Our
                    assets.
                  </li>
                </ul>
              </section>

              {/* Data Retention */}
              <section>
                <h2>
                  Data Retention
                </h2>
                <p>
                  We retain Your Personal Data only for as long as necessary to fulfill
                  the purposes outlined in this Privacy Policy. Specifically:
                </p>
                <ul>
                  <li>
                    <strong>Client Project Data:</strong>{" "}
                    Retained for 3 years after project completion for warranty, support,
                    and legal compliance purposes
                  </li>
                  <li>
                    <strong>Payment Records:</strong>{" "}
                    Retained for 7 years as required by tax and accounting regulations
                  </li>
                  <li>
                    <strong>Marketing Data:</strong>{" "}
                    Retained until You opt-out or request deletion
                  </li>
                  <li>
                    <strong>Website Usage Data:</strong>{" "}
                    Retained for up to 14 months (our Google Analytics event data retention setting)
                  </li>
                  <li>
                    <strong>SMS Consent Records:</strong>{" "}
                    Retained for 4 years after last interaction as required by TCPA
                  </li>
                </ul>
                <p>
                  After the retention period expires, Your data will be securely deleted
                  or anonymized, unless a longer retention period is required by law.
                </p>
              </section>

              {/* International Data Transfers */}
              <section>
                <h2>
                  International Data Transfers
                </h2>
                <p>
                  Your information, including Personal Data, may be transferred to and
                  maintained on servers located outside of Your state, province, country,
                  or other governmental jurisdiction where data protection laws may differ
                  from those in Your jurisdiction.
                </p>
                <p>
                  We use third-party service providers based in the United States,
                  including:
                </p>
                <ul>
                  <li>Stripe (payment processing) - USA/EU</li>
                  <li>Twilio (SMS services) - USA</li>
                  <li>Resend (email services) - USA</li>
                  <li>Google (analytics, advertising, reCAPTCHA) - USA/Global</li>
                  <li>Meta and LinkedIn (advertising measurement) - USA/Global</li>
                  <li>OpenAI (AI chat assistant) - USA</li>
                  <li>Sentry (error monitoring) - USA</li>
                  <li>Calendly (appointment scheduling) - USA</li>
                  <li>Vercel (hosting) - USA/Global</li>
                </ul>
                <p>
                  These providers comply with applicable data protection frameworks and
                  implement appropriate safeguards for international transfers, including
                  Standard Contractual Clauses (SCCs) where applicable.
                </p>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-white/90 font-semibold font-inter">
                    Note: RC Web Solutions LLC does not actively target or market services
                    to residents of the European Union. Our primary market is the United States,
                    specifically small businesses in the Houston, Texas area.
                  </p>
                </div>
              </section>

              {/* Service Providers */}
              <section>
                <h2>
                  Service Providers
                </h2>

                <h3>
                  Analytics
                </h3>
                <div className="mb-4">
                  <h4>
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

                <h3>
                  Email Marketing
                </h3>
                <div className="mb-4">
                  <h4>
                    Resend
                  </h4>
                  <p>
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

                <h3>
                  SMS Service Providers
                </h3>
                <div className="mb-4">
                  <h4>
                    Twilio
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    We use Twilio as our SMS service provider to send you text
                    messages. Twilio&apos;s services are subject to their
                    privacy policy and terms of service.
                  </p>
                  <p>
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

                <h3>
                  Payments
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4>
                      Stripe
                    </h4>
                    <p>
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
                    <h4>
                      Zelle
                    </h4>
                    <p>
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

                <h3>
                  Advertising Measurement
                </h3>
                <div className="mb-4">
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    Only after You choose &ldquo;Accept All&rdquo; in the cookie
                    banner, We load Google Ads, the Meta Pixel and the LinkedIn
                    Insight Tag to measure whether our ads lead to contacts or
                    purchases. Their privacy policies:
                  </p>
                  <ul>
                    <li>
                      Google Ads:{" "}
                      <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://policies.google.com/privacy
                    </a>
                    </li>
                    <li>
                      Meta:{" "}
                      <a
                      href="https://www.facebook.com/privacy/policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://www.facebook.com/privacy/policy
                    </a>
                    </li>
                    <li>
                      LinkedIn:{" "}
                      <a
                      href="https://www.linkedin.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://www.linkedin.com/legal/privacy-policy
                    </a>
                    </li>
                  </ul>
                </div>

                <h3>
                  AI Chat Assistant
                </h3>
                <div className="mb-4">
                  <h4>
                    OpenAI
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    The messages You type into the chat widget on this website
                    are sent to OpenAI to generate the reply. We do not store
                    chat transcripts, and under OpenAI&apos;s API terms Your
                    messages are not used to train their models. Please do not
                    share passwords, payment details or other sensitive
                    information in the chat.
                  </p>
                  <p>
                    OpenAI Privacy Policy:{" "}
                    <a
                      href="https://openai.com/policies/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://openai.com/policies/privacy-policy
                    </a>
                  </p>
                </div>

                <h3>
                  Error Monitoring
                </h3>
                <div className="mb-4">
                  <h4>
                    Sentry
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    When something breaks on the website, technical details
                    about the error (page, browser type and, in some cases, the
                    IP address of the request) are sent to Sentry so We can fix it. This data
                    is kept for 90 days.
                  </p>
                  <p>
                    Sentry Privacy Policy:{" "}
                    <a
                      href="https://sentry.io/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://sentry.io/privacy/
                    </a>
                  </p>
                </div>

                <h3>
                  Appointment Scheduling
                </h3>
                <div className="mb-4">
                  <h4>
                    Calendly
                  </h4>
                  <p className="text-white/80 leading-relaxed font-inter mb-2">
                    When You book a call on our Schedule page, Calendly collects
                    Your name, email address and the chosen time to create the
                    appointment.
                  </p>
                  <p>
                    Calendly Privacy Policy:{" "}
                    <a
                      href="https://calendly.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      https://calendly.com/privacy
                    </a>
                  </p>
                </div>
              </section>

              {/* Cookies and Tracking Technologies */}
              <section>
                <h2>
                  Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on
                  Our Service and store certain information. The technologies We use include:
                </p>

                <h3>
                  Types of Cookies We Use
                </h3>
                <ul className="space-y-3 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>
                    <strong>Essential Cookies:</strong>{" "}
                    Required for the website to function (Your cookie choice,
                    the Stripe payment session, and spam protection on forms
                    through Google reCAPTCHA)
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong>{" "}
                    Google Analytics cookies (_ga, _gid, _gat) to understand how visitors
                    interact with our website
                  </li>
                  <li>
                    <strong>Advertising Cookies:</strong>{" "}
                    Used by Google Ads, the Meta Pixel and the LinkedIn Insight Tag to
                    measure ad performance; only set after You choose &ldquo;Accept
                    All&rdquo;
                  </li>
                  <li>
                    <strong>Preference Storage:</strong>{" "}
                    Your cookie choice is kept in Your browser&apos;s local storage so
                    We do not ask again on every visit
                  </li>
                </ul>

                <h3>
                  Third-Party Cookies
                </h3>
                <p>
                  The following third parties may place cookies on Your device:
                </p>
                <ul>
                  <li>Google Analytics - Website traffic analysis</li>
                  <li>Google Ads - Conversion tracking and remarketing</li>
                  <li>Meta (Facebook) Pixel - Ad conversion tracking</li>
                  <li>LinkedIn Insight Tag - Ad conversion tracking</li>
                  <li>Google reCAPTCHA - Spam protection when You submit a form</li>
                  <li>Calendly - Booking widget on the Schedule page</li>
                  <li>Stripe - Secure payment processing</li>
                </ul>

                <h3>
                  Managing Cookies
                </h3>
                <p>
                  You can control and manage cookies in several ways:
                </p>
                <ul>
                  <li>
                    <strong>Cookie Settings:</strong>{" "}
                    Change Your choice at any time with the{" "}
                    <CookieSettingsButton className="text-gold hover:text-gold/80 underline cursor-pointer">
                      Cookie Settings
                    </CookieSettingsButton>{" "}
                    link, also available in the footer of every page
                  </li>
                  <li>
                    <strong>Browser Settings:</strong>{" "}
                    Most browsers allow You to refuse or delete cookies through their settings
                  </li>
                  <li>
                    <strong>Google Analytics Opt-Out:</strong>{" "}
                    Install the Google Analytics Opt-out Browser Add-on
                  </li>
                  <li>
                    <strong>Ad Personalization:</strong>{" "}
                    Opt out at aboutads.info or networkadvertising.org
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-inter mt-4">
                  Note: Disabling cookies may affect the functionality of our website.
                </p>
              </section>

              {/* GDPR Privacy */}
              <section>
                <h2>
                  GDPR Privacy
                </h2>

                <h3>
                  Your Rights under the GDPR
                </h3>
                <p>
                  You have the right under this Privacy Policy, and by law if
                  You are within the EU, to:
                </p>
                <ul>
                  <li>
                    <strong>
                      Request access to Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong>
                      Request correction of the Personal Data that We hold about
                      You
                    </strong>
                  </li>
                  <li>
                    <strong>
                      Object to processing of Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong>
                      Request erasure of Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong>
                      Request the transfer of Your Personal Data
                    </strong>
                  </li>
                  <li>
                    <strong>Withdraw Your consent</strong>
                  </li>
                </ul>
              </section>

              {/* CCPA/CPRA Privacy */}
              <section>
                <h2>
                  CCPA/CPRA Privacy Notice
                </h2>
                <p>
                  This privacy notice section for California residents
                  supplements the information contained in Our Privacy Policy
                  and it applies solely to all visitors, users, and others who
                  reside in the State of California.
                </p>

                <h3>
                  Your Rights under the CCPA/CPRA
                </h3>
                <p>
                  The CCPA/CPRA provides California residents with specific
                  rights regarding their personal information. If You are a
                  resident of California, You have the following rights:
                </p>
                <ul>
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

                <h3>
                  Exercising Your CCPA/CPRA Rights
                </h3>
                <p>
                  To exercise any of Your rights under the CCPA/CPRA, You may
                  contact Us using the contact information provided at the
                  bottom of this Privacy Policy.
                </p>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
                  <p className="text-white/90 font-semibold font-inter mb-2">
                    Response Timeframe:
                  </p>
                  <p className="text-white/80 font-inter">
                    Upon receiving Your request, We will respond within{" "}
                    <strong>45 calendar days</strong>. If
                    We require more time (up to an additional 45 days), We will
                    inform You of the reason and extension period in writing.
                  </p>
                </div>
                <p>
                  <strong>Identity Verification:</strong>{" "}
                  To protect Your privacy and security, We may ask You to verify
                  Your identity before responding to Your request. We will match
                  the identifying information You provide with the information
                  We have on file. If We cannot verify Your identity, We may
                  request additional information.
                </p>
                <p>
                  <strong>Authorized Agents:</strong> You
                  may designate an authorized agent to make requests on Your
                  behalf. To do so, You must provide the agent with written
                  permission, and We may require proof of the agent&apos;s
                  authority and identity.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2>
                  Children&apos;s Privacy
                </h2>
                <p>
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
              <section>
                <h2>
                  Changes to this Privacy Policy
                </h2>
                <p>
                  We may update Our Privacy Policy from time to time. We will
                  post the new Privacy Policy on this page and update the
                  &ldquo;Last updated&rdquo; date at the top. For material
                  changes We will also show a prominent notice on Our Service
                  before the change takes effect.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 max-w-5xl mx-auto reveal">
          <div className="bg-linear-to-r from-gold/10 to-transparent rounded-2xl border border-gold/20 p-8">
            <h2 className="text-2xl text-gold font-iceland mb-6">
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

              <PhoneLink
                href="tel:+13463757534"
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors group"
              >
                <PhoneIcon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold">By phone:</div>
                  <div className="text-sm">+1 346-375-7534</div>
                </div>
              </PhoneLink>

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
                  <strong>RC Web Solutions LLC</strong>
                </p>
                <p>{COMPANY_ADDRESS}</p>
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
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center flex justify-center items-center reveal">
          <p className="text-white/50 text-sm font-inter">
            For GDPR purposes, RC Web Solutions LLC is the Data Controller
          </p>
        </div>
      </div>
    </section>
  );
}
