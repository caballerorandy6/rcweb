"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import ClientOnly from "@/components/ui/ClientOnly";
import { trackFBContact, trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";
import { event as trackEvent } from "@/lib/analytics";

const Chat = dynamic(() => import("@/components/ui/Chat"), {
  ssr: false,
});

// Animation variants - defined outside component for performance
const menuVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

// Inline SVG icons with proper fill for contrast
const WhatsAppIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

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

const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// Primary contact actions for lead generation
const primaryActions = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: "https://wa.me/18325465983?text=Hi%20Randy%2C%20I%27m%20interested%20in%20discussing%20a%20web%20project",
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
    url: "https://www.linkedin.com/company/rcwebsolutions",
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
    bgClass: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
  },
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com/@rcwebsolutionsllc",
    Icon: TikTokIcon,
    bgClass: "bg-black hover:bg-gray-900 ring-1 ring-white/20",
  },
  {
    id: "x",
    name: "X",
    url: "https://x.com/RCWeb2025",
    Icon: XIcon,
    bgClass: "bg-black hover:bg-gray-900 ring-1 ring-white/20",
  },
];

const FloatingCTA = () => {
  const [isContactInView, setIsContactInView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const handlePrimaryClick = (action: (typeof primaryActions)[0]) => {
    // Track conversions
    if (action.id === "whatsapp") {
      trackFBContact();
    } else if (action.id === "phone") {
      trackFBPhoneCall();
    }
    trackLinkedInConversion();
    trackEvent({
      action: "floating_cta_click",
      category: "engagement",
      label: action.name,
    });

    window.open(action.url, action.id === "phone" ? "_self" : "_blank");
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
    window.open(action.url, "_blank");
  };

  return (
    <ClientOnly>
      {/* Main Container */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isContactInView ? 0 : 1,
          y: isContactInView ? 50 : 0,
          pointerEvents: isContactInView ? "none" : "auto",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Expanded Menu with Glass Effect */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col gap-2 mb-2 p-3 rounded-2xl bg-gray-950/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* AI Chat Button - Priority */}
              <motion.button
                variants={itemVariants}
                onClick={handleChatOpen}
                className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 pl-3 pr-4 py-2.5 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02]"
                aria-label="Chat with AI Assistant"
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/30">
                  <Image
                    src="/maria.avif"
                    alt="Maria AI"
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <span className="font-inter font-medium text-sm whitespace-nowrap pr-1">
                  Chat with Maria
                </span>
              </motion.button>

              {/* Primary Contact Actions */}
              {primaryActions.map((action) => (
                <motion.button
                  key={action.id}
                  variants={itemVariants}
                  onClick={() => handlePrimaryClick(action)}
                  className={`group flex items-center gap-3 rounded-xl ${action.bgClass} pl-3 pr-4 py-2.5 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
                  aria-label={action.label}
                >
                  <action.Icon className="h-6 w-6" />
                  <span className="font-inter font-medium text-sm whitespace-nowrap pr-1">
                    {action.label}
                  </span>
                </motion.button>
              ))}

              {/* Divider */}
              <div className="w-full h-px bg-white/10 my-1" />

              {/* Social Links - Secondary (smaller, horizontal group) */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 px-1"
              >
                {socialActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleSocialClick(action)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.bgClass} text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110`}
                    aria-label={`Connect on ${action.name}`}
                  >
                    <action.Icon />
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
            isOpen
              ? "bg-gray-800 hover:bg-gray-700 ring-1 ring-white/10"
              : "bg-gradient-to-br from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-dark shadow-gold/30"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation when closed */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gold/40"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </ClientOnly>
  );
};

export default FloatingCTA;
