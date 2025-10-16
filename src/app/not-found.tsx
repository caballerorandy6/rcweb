// app/not-found.tsx
"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  HomeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

export default function NotFound() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Velocidad más lenta para efecto dramático
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const glitchVariants: Variants = {
    animate: {
      x: [0, -2, 2, -2, 0],
      textShadow: [
        "0 0 0 transparent",
        "2px 2px 0 #fbbf24",
        "-2px -2px 0 #f59e0b",
        "2px -2px 0 #fbbf24",
        "0 0 0 transparent",
      ],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

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
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Warning Icon */}
        <motion.div className="flex justify-center" variants={itemVariants}>
          <motion.div
            className="p-6 bg-gold/10 backdrop-blur-sm rounded-full border-2 border-gold/50"
            variants={pulseVariants}
            animate="animate"
          >
            <ExclamationTriangleIcon className="w-16 h-16 text-gold" />
          </motion.div>
        </motion.div>

        {/* 404 Text */}
        <motion.div variants={itemVariants} className="mb-4">
          <motion.h1
            className="text-8xl sm:text-9xl lg:text-[12rem] font-iceland font-bold text-gold"
            variants={glitchVariants}
            animate="animate"
          >
            404
          </motion.h1>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl font-iceland text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
            Oops! Looks like you&apos;ve ventured into uncharted territory. The
            page you&apos;re looking for doesn&apos;t exist or has been moved to
            another dimension.
          </p>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10 font-inter"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gold/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-gold">404</p>
            <p className="text-xs text-gray-400 font-inter">Error Code</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gold/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-gold">0</p>
            <p className="text-xs text-gray-400 font-inter">Pages Found</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gold/20 rounded-lg p-3">
            <p className="text-2xl font-bold text-gold">∞</p>
            <p className="text-xs text-gray-400 font-inter">Possibilities</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-all duration-200 font-inter group"
            >
              <HomeIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back Home
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-all duration-200 font-inter group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Previous Page
            </button>
          </motion.div>
        </motion.div>

        {/* Sitemap Suggestion */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="inline-flex items-center gap-2 text-gray-400 font-inter text-sm">
            <MapIcon className="w-4 h-4" />
            <span>Lost? Try our </span>
            <Link
              href="/sitemap"
              className="text-gold hover:text-gold/80 transition-colors underline"
            >
              sitemap
            </Link>
            <span> or </span>
            <Link
              href="/#contact"
              className="text-gold hover:text-gold/80 transition-colors underline"
            >
              contact us
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </section>
  );
}
