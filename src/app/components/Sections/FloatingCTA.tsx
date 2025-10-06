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
import TikTok from "@/app/components/icons/TikTok";

const getIconComponent = (name: string, iconSize?: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    LinkedIn: <Linkedin className={iconSize} />,
    Phone: <Phone className={iconSize} />,
    WhatsApp: <WhatsApp className={iconSize} />,
    "Tik Tok": <TikTok className={iconSize} />,
    Facebook: <Facebook className={iconSize} />,
    Instagram: <Instagram className={iconSize} />,
    X: <X className={iconSize} />,
  };
  return iconMap[name];
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
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "2rem",
        zIndex: 50,
        display: "flex",
        flexDirection: "column-reverse",
        gap: "1rem",
        alignItems: "flex-end",
      }}
      initial={{ opacity: 0, x: 100 }}
      animate={{
        opacity: isContactInView ? 0 : 1,
        x: isContactInView ? 100 : 0,
        pointerEvents: isContactInView ? "none" : "auto",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div
        className={`flex flex-col-reverse gap-4 items-center ${isOpen ? "animateHeadingDialog rounded-full py-4" : "items-end"}`}
      >
        {/* Toggle Button - Always visible */}
        <motion.button
          type="button"
          style={{
            display: "flex",
            height: "3rem",
            width: "3rem",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            background: "linear-gradient(to bottom right, rgb(203 178 106), rgb(250 204 21))",
            color: "white",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            transition: "all 0.3s",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={isOpen ? "Close contact options" : "Open contact options"}
          whileHover={{ rotate: 90, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 15 } }}
          whileTap={{ scale: 0.95 }}
          onTap={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            )}
          </svg>
        </motion.button>

        {/* Contact Buttons - Show/Hide based on isOpen */}
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
          initial={{ opacity: 0, y: 20, scale: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 20,
            scale: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {socialLinks.map((link) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: link.delay }}
            >
              {link.isButton ? (
                <button
                  onClick={() => handleClick(link.url, link.isButton)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${link.bgColor} text-white shadow-lg transition-all duration-200 hover:scale-110 ${link.hoverColor} hover:shadow-xl`}
                  aria-label={link.ariaLabel}
                >
                  {getIconComponent(link.name, link.iconSize)}
                </button>
              ) : (
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${link.bgColor} text-white shadow-lg transition-all duration-200 hover:scale-110 ${link.hoverColor} hover:shadow-xl`}
                  aria-label={link.ariaLabel}
                >
                  {getIconComponent(link.name, link.iconSize)}
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FloatingCTA;
