"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { socialLinks } from "@/lib/data";
import WhatsApp from "@/app/components/icons/WhatSapp";
import Linkedin from "@/app/components/icons/Linkedin";
import Facebook from "@/app/components/icons/Facebook";
import Phone from "@/app/components/icons/Phone";
import Instagram from "@/app/components/icons/Instagram";
import X from "@/app/components/icons/X";

const iconMap: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin />,
  Phone: <Phone />,
  WhatsApp: <WhatsApp />,
  Facebook: <Facebook />,
  Instagram: <Instagram />,
  X: <X />,
};

const FloatingCTA = () => {
  const ctaRef = useRef(null);
  const [isContactInView, setIsContactInView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Find the Contact section
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactInView(entry.isIntersecting);
        // Auto-close when contact section is in view
        if (entry.isIntersecting) {
          setIsOpen(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(contactSection);

    return () => observer.disconnect();
  }, []);

  const handleClick = (url: string, isButton?: boolean) => {
    if (isButton) {
      window.open(url, "_self");
    }
  };

  return (
    <motion.div
      ref={ctaRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 items-end"
      initial={{ opacity: 0, x: 100 }}
      animate={{
        opacity: isContactInView ? 0 : 1,
        x: isContactInView ? 100 : 0,
        pointerEvents: isContactInView ? "none" : "auto",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle Button - Always visible */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-gray-900 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-yellow-400 hover:shadow-xl"
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          )}
        </svg>
      </motion.button>

      {/* Contact Buttons - Show/Hide based on isOpen */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20, scale: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 20,
          scale: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {socialLinks.map((link) => (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
            transition={{ duration: 0.2, delay: link.delay }}
          >
            {link.isButton ? (
              <button
                onClick={() => handleClick(link.url, link.isButton)}
                className={`flex h-14 w-14 items-center justify-center rounded-full ${link.bgColor} text-white shadow-lg transition-all duration-200 hover:scale-110 ${link.hoverColor} hover:shadow-xl`}
                aria-label={link.ariaLabel}
              >
                {iconMap[link.name]}
              </button>
            ) : (
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-14 w-14 items-center justify-center rounded-full ${link.bgColor} text-white shadow-lg transition-all duration-200 hover:scale-110 ${link.hoverColor} hover:shadow-xl`}
                aria-label={link.ariaLabel}
              >
                {iconMap[link.name]}
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FloatingCTA;
