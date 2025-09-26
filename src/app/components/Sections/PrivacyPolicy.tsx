"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <section
      id="privacy"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-iceland text-gold mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/50">
            Last updated: September 25, 2025
          </p>
        </div>

        {/* Intro */}
        <div className="prose prose-invert max-w-none text-white/70 font-inter">
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>
          <p className="mt-4">
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>

          <h2 className="text-2xl font-iceland text-gold mt-12">
            Interpretation and Definitions
          </h2>
          <h3 className="text-xl font-iceland text-gold mt-6">
            Interpretation
          </h3>
          <p>
            The words whose initial letters are capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </p>

          <h3 className="text-xl font-iceland text-gold mt-6">Definitions</h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Company</strong> refers to RC Web Solutions LLC, 6210
              Newquay St Houston, TX 77085. For GDPR, the Company is the Data
              Controller.
            </li>
            <li>
              <strong>Website</strong> refers to RC Web, accessible from{" "}
              <Link
                href="https://rcweb.dev"
                className="text-gold hover:underline"
              >
                https://rcweb.dev
              </Link>
            </li>
            <li>
              <strong>Personal Data</strong> means any information that relates
              to an identified or identifiable individual.
            </li>
            <li>
              <strong>Service</strong> refers to the website and services
              provided by RC Web Solutions LLC.
            </li>
          </ul>

          <h2 className="text-2xl font-iceland text-gold mt-12">
            Collecting and Using Your Personal Data
          </h2>
          <p>
            While using our Service, we may ask you to provide certain
            personally identifiable information, including:
          </p>
          <ul className="list-disc pl-6">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>
              Bank account information when paying for products and services
            </li>
            <li>Usage data (IP address, browser type, pages visited, etc.)</li>
          </ul>

          <h3 className="text-xl font-iceland text-gold mt-6">
            Cookies & Tracking
          </h3>
          <p>
            We use cookies and similar tracking technologies to monitor activity
            on our Service and store certain information. You can disable
            cookies in your browser, but some features may not work properly.
          </p>

          <h3 className="text-xl font-iceland text-gold mt-6">
            Use of Personal Data
          </h3>
          <p>We may use your personal data to:</p>
          <ul className="list-disc pl-6">
            <li>Provide and maintain our Service</li>
            <li>Process payments (Stripe, Zelle)</li>
            <li>Send marketing and transactional emails (Resend)</li>
            <li>Contact you regarding updates or support</li>
            <li>Improve our website and services</li>
          </ul>

          <h3 className="text-xl font-iceland text-gold mt-6">
            Third-Party Services
          </h3>
          <p>
            We use third-party providers for analytics, payments, and email:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Google Analytics</strong> —{" "}
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                className="text-gold hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <strong>Resend</strong> —{" "}
              <Link
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                className="text-gold hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <strong>Stripe</strong> —{" "}
              <Link
                href="https://stripe.com/us/privacy"
                target="_blank"
                className="text-gold hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <strong>Zelle</strong> —{" "}
              <Link
                href="https://www.zelle.com/legal/legal-and-privacy"
                target="_blank"
                className="text-gold hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>

          <h2 className="text-2xl font-iceland text-gold mt-12">Your Rights</h2>
          <p>
            You have the right to access, correct, delete, and restrict the use
            of your personal data.
          </p>

          <h2 className="text-2xl font-iceland text-gold mt-12">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact
            us at:
          </p>
          <ul className="list-none">
            <li>
              Email:{" "}
              <a
                href="mailto:contactus@rcweb.dev"
                className="text-gold hover:underline"
              >
                contactus@rcweb.dev
              </a>
            </li>
            <li>
              Website:{" "}
              <Link href="/#contact" className="text-gold hover:underline">
                Contact Form
              </Link>
            </li>
            <li>
              Phone:{" "}
              <a href="tel:8325465983" className="text-gold hover:underline">
                832-546-5983
              </a>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
          <Link
            href="https://www.privacypolicies.com/live/1efd6eca-e9ce-4dc7-89dc-8b8e5cb8102a"
            target="_blank"
            className="px-6 py-2 bg-gold text-black rounded-lg font-semibold hover:bg-yellow-400 transition font-inter"
          >
            View Full Policy
          </Link>
          <Link
            href="/privacy-policy.pdf"
            download="Randy Caballero - Privacy Policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition font-inter"
          >
            Download PDF
          </Link>
        </div>
      </div>
    </section>
  );
}
