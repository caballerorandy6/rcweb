"use client";

import WhatsAppIcon from "@/components/icons/WhatsApp";
import { COMPANY } from "@/lib/company";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import clsx from "clsx";
import { XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { trackFBContact } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";
import { trackPhoneConversion } from "@/lib/phoneConversion";
import { event as trackEvent } from "@/lib/analytics";

const Chat = dynamic(() => import("@/components/ui/Chat"), {
  ssr: false,
});

// Menu items replay the entrance each time the menu leaves display:none
const menuItemClass = "animate-enter";
const menuItemDelay = (index: number) => ({ animationDelay: `${index * 50}ms` });

// Inline SVG icons with proper fill for contrast

const PhoneIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const LinkedInIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const TikTokIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

// Primary contact actions for lead generation
const primaryActions = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: COMPANY.whatsappHref,
    Icon: WhatsAppIcon,
    bgClass: "bg-[#25D366] hover:bg-[#1da851]",
    label: "WhatsApp",
  },
  {
    id: "phone",
    name: "Phone",
    url: "tel:+13463757534",
    Icon: PhoneIcon,
    bgClass: "bg-emerald-600 hover:bg-emerald-700",
    label: "Call Now",
  },
];

// Social media links (secondary)
const socialActions = [
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/109039912/",
    Icon: LinkedInIcon,
    bgClass: "bg-[#0A66C2] hover:bg-[#004182]",
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/rcwebsolutionsllc",
    Icon: FacebookIcon,
    bgClass: "bg-[#1877F2] hover:bg-[#155DBB]",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/rcwebsolutionsllc",
    Icon: InstagramIcon,
    bgClass: "bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
  },
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com/@rcwebsolutionsllc",
    Icon: TikTokIcon,
    bgClass: "bg-black hover:bg-gray-900 ring-1 ring-white/20",
  },
];

const FloatingCTA = () => {
  const [isContactInView, setIsContactInView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenuOnEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  };

  // Hide when contact section is visible
  useEffect(() => {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactInView(entry.isIntersecting);
        if (entry.isIntersecting) setIsOpen(false);
      },
      { threshold: 0.3 }
    );

    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  // Links navigate on their own; the handlers only track and close the menu
  const handlePrimaryClick = (action: (typeof primaryActions)[0]) => {
    if (action.id === "phone") {
      trackPhoneConversion();
    } else {
      if (action.id === "whatsapp") trackFBContact();
      trackLinkedInConversion();
    }
    trackEvent({
      action: "floating_cta_click",
      category: "engagement",
      label: action.name,
    });
    setIsOpen(false);
  };

  const handleChatOpen = () => {
    trackEvent({
      action: "ai_chat_open",
      category: "engagement",
      label: "floating_cta",
    });
    setIsChatOpen(true);
    setIsOpen(false);
  };

  const handleSocialClick = (action: (typeof socialActions)[0]) => {
    trackEvent({
      action: "social_click",
      category: "engagement",
      label: action.name,
    });
  };

  return (
    <>
      {/* Main Container: enters once on mount (outer), slides away while the
          contact section is in view (inner) */}
      <div className="fixed bottom-6 right-6 z-50 animate-enter">
        <div
          inert={isContactInView}
          className={clsx(
            "flex flex-col items-end gap-3 transition duration-300 ease-out",
            isContactInView && "opacity-0 translate-y-12 pointer-events-none",
          )}
        >
          {/* Expanded Menu with Glass Effect: display toggles at the end of the
            transition (allow-discrete) and @starting-style drives the entrance */}
          <div
            id="floating-contact-menu"
            onKeyDown={closeMenuOnEscape}
            className={clsx(
              "flex flex-col gap-2 mb-2 p-3 rounded-2xl bg-gray-950/95 border border-white/10 shadow-2xl shadow-black/50 origin-bottom-right transition transition-discrete duration-200 ease-out",
              isOpen
                ? "starting:opacity-0 starting:scale-90 starting:translate-y-4"
                : "hidden opacity-0 scale-90 translate-y-4",
            )}
          >
            {/* AI Chat Button - Priority */}
            <button
              type="button"
              style={menuItemDelay(0)}
              onClick={handleChatOpen}
              className={`${menuItemClass} group flex items-center gap-3 rounded-xl bg-linear-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light pl-3 pr-4 py-2.5 text-gray-900 shadow-lg hover:shadow-gold/25 transition duration-200 hover:scale-[1.02]`}
              aria-expanded={isChatOpen}
              aria-controls="maria-chat"
            >
              <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/30">
                <Image
                  src="/maria.avif"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-inter font-medium text-sm whitespace-nowrap pr-1">
                Chat with Maria
              </span>
            </button>

            {/* Primary Contact Actions */}
            {primaryActions.map((action, index) => (
              <a
                key={action.id}
                href={action.url}
                {...(action.id === "phone"
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                style={menuItemDelay(index + 1)}
                onClick={() => handlePrimaryClick(action)}
                className={`${menuItemClass} group flex items-center gap-3 rounded-xl ${action.bgClass} pl-3 pr-4 py-2.5 text-white shadow-lg hover:shadow-xl transition duration-200 hover:scale-[1.02]`}
              >
                <action.Icon className="h-6 w-6" />
                <span className="font-inter font-medium text-sm whitespace-nowrap pr-1">
                  {action.label}
                </span>
              </a>
            ))}

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-1" />

            {/* Social Links - Secondary (smaller, horizontal group) */}
            <div
              style={menuItemDelay(primaryActions.length + 1)}
              className={`${menuItemClass} flex items-center justify-center gap-2 px-1`}
            >
              {socialActions.map((action) => (
                <a
                  key={action.id}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(action)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.bgClass} text-white shadow-md hover:shadow-lg transition duration-200 hover:scale-110`}
                  aria-label={`Connect on ${action.name}`}
                >
                  <action.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={closeMenuOnEscape}
            className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition duration-300 hover:scale-110 active:scale-95 ${
              isOpen
                ? "bg-gray-800 hover:bg-gray-700 ring-1 ring-white/10"
                : "bg-linear-to-br from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-dark"
            }`}
            aria-expanded={isOpen}
            aria-controls="floating-contact-menu"
            aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
          >
            {/* The key remounts the icon so the swap replays the entrance */}
            {isOpen ? (
              <XMarkIcon
                key="close"
                className="h-6 w-6 text-white animate-enter"
              />
            ) : (
              <ChatBubbleLeftRightIcon
                key="open"
                className="h-6 w-6 text-gray-900 animate-enter"
              />
            )}

            {/* Pulse ring when closed (three beats, then rests) */}
            {!isOpen && (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gold/40 animate-pulse-ring"
              />
            )}
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen ? (
        <Chat
          onClose={() => {
            setIsChatOpen(false);
            toggleRef.current?.focus();
          }}
        />
      ) : null}
    </>
  );
};

export default FloatingCTA;
