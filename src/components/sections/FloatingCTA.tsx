"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import WhatsApp from "@/components/icons/WhatSapp";
import Phone from "@/components/icons/Phone";
import Linkedin from "@/components/icons/Linkedin";
import Facebook from "@/components/icons/Facebook";
import Instagram from "@/components/icons/Instagram";
import TikTok from "@/components/icons/TikTok";
import X from "@/components/icons/X";
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

// Priority contact actions for lead generation
const primaryActions = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: "https://wa.me/18325465983?text=Hi%20Randy%2C%20I%27m%20interested%20in%20discussing%20a%20web%20project",
    Icon: WhatsApp,
    bgClass: "bg-[#25D366] hover:bg-[#1da851]",
    label: "WhatsApp",
  },
  {
    id: "phone",
    name: "Phone",
    url: "tel:+13463757534",
    Icon: Phone,
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
    Icon: Linkedin,
    bgClass: "bg-[#0A66C2] hover:bg-[#004182]",
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/rcwebsolutionsllc",
    Icon: Facebook,
    bgClass: "bg-[#1877F2] hover:bg-[#155DBB]",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/rcwebsolutionsllc",
    Icon: Instagram,
    bgClass: "bg-[#E1306C] hover:bg-[#C13584]",
  },
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com/@rcwebsolutionsllc",
    Icon: TikTok,
    bgClass: "bg-gray-900 hover:bg-gray-800",
  },
  {
    id: "x",
    name: "X",
    url: "https://x.com/RCWeb2025",
    Icon: X,
    bgClass: "bg-gray-900 hover:bg-gray-700",
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
        {/* Expanded Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col gap-2 mb-2"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* AI Chat Button - Priority */}
              <motion.button
                variants={itemVariants}
                onClick={handleChatOpen}
                className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 pl-3 pr-4 py-2.5 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
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
                <span className="font-medium text-sm whitespace-nowrap pr-1">
                  Chat with Maria
                </span>
              </motion.button>

              {/* Primary Contact Actions */}
              {primaryActions.map((action) => (
                <motion.button
                  key={action.id}
                  variants={itemVariants}
                  onClick={() => handlePrimaryClick(action)}
                  className={`group flex items-center gap-3 rounded-full ${action.bgClass} pl-3 pr-4 py-2.5 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                  aria-label={action.label}
                >
                  <action.Icon className="h-7 w-7" />
                  <span className="font-medium text-sm whitespace-nowrap pr-1">
                    {action.label}
                  </span>
                </motion.button>
              ))}

              {/* Divider */}
              <div className="w-full h-px bg-white/20 my-1" />

              {/* Social Links - Secondary (smaller, horizontal group) */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-end gap-2"
              >
                {socialActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleSocialClick(action)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${action.bgClass} text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110`}
                    aria-label={`Connect on ${action.name}`}
                  >
                    <action.Icon className="h-5 w-5" />
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
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gradient-to-br from-gold via-yellow-400 to-amber-500 hover:from-yellow-400 hover:via-amber-400 hover:to-gold"
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
