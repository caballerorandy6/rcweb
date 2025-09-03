"use client";
import Link from "next/link";
import WhatsApp from "@/app/components/icons/WhatSapp";
import Linkedin from "@/app/components/icons/Linkedin";
import Phone from "@/app/components/icons/Phone";

const FloatingCTA = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi Randy, I saw your portfolio and I'm interested in discussing a project"
    );
    const phone = "18325465983";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handlePhoneClick = () => {
    const phone = "+18325465983";
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* LinkedIn Button */}
      <Link
        href="https://www.linkedin.com/in/caballerorandy/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#004182] hover:shadow-xl"
        aria-label="Connect on LinkedIn"
      >
        <Linkedin />
      </Link>

      {/* Phone Button */}
      <button
        onClick={handlePhoneClick}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-blue-700 hover:shadow-xl"
        aria-label="Call directly"
      >
        <Phone />
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#128C7E] hover:shadow-xl"
        aria-label="Contact via WhatsApp"
      >
        <WhatsApp />
      </button>
    </div>
  );
};

export default FloatingCTA;
