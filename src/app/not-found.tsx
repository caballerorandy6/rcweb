// app/not-found.tsx
"use client";

import Link from "next/link";
import type { Route } from "next";
import Button from "@/components/ui/Button";
import {
  HomeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

// Staggered entrance: each block waits a bit longer than the previous one
const enter = (step: number) => ({ animationDelay: `${300 + step * 200}ms` });

export default function NotFound() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Velocidad más lenta para efecto dramático
    }
  }, []);

  return (
    <section
      id="not-found"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/404-background.webm" type="video/webm" />
        </video>

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center animate-enter" style={enter(0)}>
          <div className="p-6 bg-gold/10 backdrop-blur-xs rounded-full border-2 border-gold/50 animate-pulse">
            <ExclamationTriangleIcon className="w-16 h-16 text-gold" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-4 animate-enter" style={enter(1)}>
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-iceland text-gold animate-glitch">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="animate-enter" style={enter(2)}>
          <h2 className="text-3xl sm:text-4xl font-iceland text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
            Oops! Looks like you&apos;ve ventured into uncharted territory. The
            page you&apos;re looking for doesn&apos;t exist or has been moved to
            another dimension.
          </p>
        </div>

        {/* Fun Stats */}
        <div
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10 font-inter animate-enter"
          style={enter(3)}
        >
          <div className="bg-gray-900/50 backdrop-blur-xs border border-gold/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-gold">404</p>
            <p className="text-xs text-gray-400 font-inter">Error Code</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xs border border-gold/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-gold">0</p>
            <p className="text-xs text-gray-400 font-inter">Pages Found</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xs border border-gold/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-gold">∞</p>
            <p className="text-xs text-gray-400 font-inter">Possibilities</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-enter"
          style={enter(4)}
        >
          <Button href="/" size="lg">
            <HomeIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back Home
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Previous Page
          </Button>
        </div>

        {/* Sitemap Suggestion */}
        <div className="mt-12 animate-enter" style={enter(5)}>
          <div className="inline-flex items-center gap-2 text-gray-400 font-inter text-sm">
            <MapIcon className="w-4 h-4" />
            <span>Lost? Try our </span>
            <Link
              href={"/sitemap" as Route}
              className="text-gold hover:text-gold/80 transition-colors underline"
            >
              sitemap
            </Link>
            <span> or </span>
            <Link
              href={"/#contact" as Route}
              className="text-gold hover:text-gold/80 transition-colors underline"
            >
              contact us
            </Link>
          </div>
        </div>
      </div>

      {/* Background glows (static: a drifting blur-3xl layer repaints forever) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
