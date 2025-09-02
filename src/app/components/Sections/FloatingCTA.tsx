"use client";

import Link from "next/link";
import WhatsApp from "@/app/components/icons/WhatSapp";
import Linkedin from "@/app/components/icons/Linkedin";

const FloatingCTA = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi Randy, I saw your portfolio and I'm interested in discussing a project"
    );
    const phone = "18325465983";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Link
        href="https://www.linkedin.com/in/caballerorandy/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-gold shadow-lg transition-all duration-200 hover:scale-110 hover:bg-gold/10"
        aria-label="Connect on LinkedIn"
      >
        <Linkedin />
      </Link>
      <button
        onClick={handleWhatsAppClick}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <WhatsApp />
      </button>
    </div>
  );
};

export default FloatingCTA;
